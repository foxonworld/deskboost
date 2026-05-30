# DeskBoost — Hệ Thống Chăm Sóc Cây Thông Minh

Ứng dụng ASP.NET Core theo **Clean Architecture**, tích hợp AI chẩn đoán bệnh cây, nhắc lịch chăm sóc, chatbox AI và giới thiệu sản phẩm.

---

## Mục lục

- [Kiến trúc tổng quan](#kiến-trúc-tổng-quan)
- [Cấu trúc thư mục đầy đủ](#cấu-trúc-thư-mục-đầy-đủ)
- [Database Schema](#database-schema)
- [Giai đoạn 1 — MVP Chẩn đoán bệnh](#giai-đoạn-1--mvp-chẩn-đoán-bệnh)
- [Giai đoạn 2 — Chatbox AI](#giai-đoạn-2--chatbox-ai)
- [Giai đoạn 3 — Nhắc lịch chăm sóc](#giai-đoạn-3--nhắc-lịch-chăm-sóc)
- [Giai đoạn 4 — Giới thiệu sản phẩm](#giai-đoạn-4--giới-thiệu-sản-phẩm)
- [Dependency Injection](#dependency-injection)
- [Biến môi trường](#biến-môi-trường)
- [Roadmap](#roadmap)

---

## Kiến trúc tổng quan

```
┌─────────────────────────────────────────────────────┐
│                   DeskBoost.API                      │
│         Controllers · Middleware · Program           │
└──────────────────────┬──────────────────────────────┘
                       │ gọi
┌──────────────────────▼──────────────────────────────┐
│              DeskBoost.Application                   │
│    Features (CQRS) · Interfaces · Validators         │
└──────────┬───────────────────────┬──────────────────┘
           │ implement             │ implement
┌──────────▼──────────┐  ┌────────▼──────────────────┐
│  DeskBoost.Domain   │  │  DeskBoost.Infrastructure  │
│  Entities · Enums   │  │  Persistence · AI · Storage│
└─────────────────────┘  └───────────────────────────┘
```

**Nguyên tắc:**
- `Domain` không phụ thuộc vào ai
- `Application` chỉ phụ thuộc `Domain`
- `Infrastructure` implement interface của `Application`
- `API` chỉ gọi `Application`

---

## Cấu trúc thư mục đầy đủ

```
D
---

## Database Schema

### Sơ đồ quan hệ

```
users
 ├──< user_plants >──┐
 ├──< collected_samples        │
 ├──< diagnosis_feedback       │
 └──< chat_sessions            │
                     │
              plant_types <──< care_schedules
                     │               └──< care_logs
              plant_diseases
                     └──< disease_treatments
                     └──< product_disease_mappings >──< products
                                                           └──< product_categories
```

### Script SQL đầy đủ

```sql
-- ================================================================
-- DeskBoost — SQL Server Schema
-- Thứ tự: Domain tables → Feature tables → Junction tables
-- ================================================================

-- ── 1. PLANT TYPES ──────────────────────────────────────────────
CREATE TABLE plant_types (
    id            INT           PRIMARY KEY IDENTITY(1,1),
    name_vi       NVARCHAR(100) NOT NULL,
    name_en       NVARCHAR(100) NOT NULL,
    name_science  NVARCHAR(150),
    category      NVARCHAR(50)  NOT NULL DEFAULT 'indoor',
    -- 'indoor' | 'outdoor' | 'crop'
    description   NVARCHAR(500),
    image_url     NVARCHAR(500),
    is_active     BIT           NOT NULL DEFAULT 1,
    created_at    DATETIME2     NOT NULL DEFAULT GETUTCDATE()
);

-- ── 2. PLANT DISEASES ───────────────────────────────────────────
CREATE TABLE plant_diseases (
    id               INT           PRIMARY KEY IDENTITY(1,1),
    name_vi          NVARCHAR(100) NOT NULL,
    name_en          NVARCHAR(100) NOT NULL,
    slug             NVARCHAR(100) NOT NULL UNIQUE,   -- 'leaf-spot'
    description      NVARCHAR(1000),
    cause            NVARCHAR(500),
    severity_default NVARCHAR(20)  NOT NULL DEFAULT 'medium',
    -- 'low' | 'medium' | 'high'
    prevention       NVARCHAR(1000),
    is_active        BIT           NOT NULL DEFAULT 1,
    created_at       DATETIME2     NOT NULL DEFAULT GETUTCDATE()
);

-- ── 3. DISEASE TREATMENTS ───────────────────────────────────────
CREATE TABLE disease_treatments (
    id            INT           PRIMARY KEY IDENTITY(1,1),
    disease_id    INT           NOT NULL REFERENCES plant_diseases(id),
    plant_type_id INT           REFERENCES plant_types(id),
    -- NULL = áp dụng cho mọi loài
    step_order    INT           NOT NULL,
    step_vi       NVARCHAR(500) NOT NULL,
    step_en       NVARCHAR(500),
    created_at    DATETIME2     NOT NULL DEFAULT GETUTCDATE()
);

-- ── 4. USERS ────────────────────────────────────────────────────
CREATE TABLE users (
    id            NVARCHAR(50)  PRIMARY KEY,   -- GUID từ Identity
    email         NVARCHAR(200) NOT NULL UNIQUE,
    display_name  NVARCHAR(100),
    avatar_url    NVARCHAR(500),
    role          NVARCHAR(20)  NOT NULL DEFAULT 'user',
    -- 'user' | 'expert' | 'admin'
    timezone      NVARCHAR(50)  DEFAULT 'Asia/Ho_Chi_Minh',
    is_active     BIT           NOT NULL DEFAULT 1,
    created_at    DATETIME2     NOT NULL DEFAULT GETUTCDATE(),
    last_seen_at  DATETIME2
);

-- ── 5. USER PLANTS (cây của người dùng) ─────────────────────────
CREATE TABLE user_plants (
    id             INT           PRIMARY KEY IDENTITY(1,1),
    user_id        NVARCHAR(50)  NOT NULL REFERENCES users(id),
    plant_type_id  INT           REFERENCES plant_types(id),
    nickname       NVARCHAR(100),            -- "Bé Monstera cửa sổ"
    location       NVARCHAR(100),            -- "Phòng khách", "Ban công"
    acquired_date  DATE,
    pot_size_cm    INT,
    notes          NVARCHAR(500),
    cover_image_url NVARCHAR(500),
    is_active      BIT           NOT NULL DEFAULT 1,
    created_at     DATETIME2     NOT NULL DEFAULT GETUTCDATE()
);

-- ── 6. COLLECTED SAMPLES (trung tâm giai đoạn 1 + thu thập data) ─
CREATE TABLE collected_samples (
    id                  BIGINT        PRIMARY KEY IDENTITY(1,1),

    -- Ảnh
    image_path          NVARCHAR(500) NOT NULL,
    image_hash          NVARCHAR(64)  NOT NULL,        -- MD5
    image_size_kb       INT,
    width_px            INT,
    height_px           INT,

    -- Liên kết
    user_id             NVARCHAR(50)  REFERENCES users(id),
    user_plant_id       INT           REFERENCES user_plants(id),
    plant_type_id       INT           REFERENCES plant_types(id),
    plant_type_raw      NVARCHAR(100),                 -- User nhập tự do

    -- Kết quả Plant.id (tầng 1)
    plantid_disease     NVARCHAR(100),
    plantid_confidence  FLOAT,
    plantid_is_healthy  BIT,
    plantid_raw_json    NVARCHAR(MAX),
    plantid_called_at   DATETIME2,

    -- Kết quả Gemini (tầng 2)
    gemini_severity     NVARCHAR(20),
    gemini_cause        NVARCHAR(500),
    gemini_treatment    NVARCHAR(2000),
    gemini_prevention   NVARCHAR(1000),
    gemini_called_at    DATETIME2,

    -- Gán nhãn (crowdsourcing → dùng để train model)
    confirmed_label       NVARCHAR(100),
    label_status          NVARCHAR(20) NOT NULL DEFAULT 'pending',
    -- 'pending' | 'auto_approved' | 'confirmed' | 'rejected' | 'needs_expert'
    confirmed_by_user_id  NVARCHAR(50) REFERENCES users(id),
    confirmed_at          DATETIME2,
    expert_note           NVARCHAR(500),

    -- Training
    is_used_in_training   BIT          NOT NULL DEFAULT 0,
    training_batch_id     INT,

    -- Metadata
    source                NVARCHAR(20) NOT NULL DEFAULT 'web',
    -- 'web' | 'mobile' | 'api'
    processing_ms         INT,
    created_at            DATETIME2    NOT NULL DEFAULT GETUTCDATE(),

    CONSTRAINT uq_image_hash UNIQUE (image_hash)
);

CREATE INDEX idx_samples_status   ON collected_samples(label_status);
CREATE INDEX idx_samples_label    ON collected_samples(confirmed_label);
CREATE INDEX idx_samples_training ON collected_samples(is_used_in_training, confirmed_label);
CREATE INDEX idx_samples_user     ON collected_samples(user_id, created_at DESC);

-- ── 7. DIAGNOSIS FEEDBACK ───────────────────────────────────────
CREATE TABLE diagnosis_feedback (
    id          BIGINT        PRIMARY KEY IDENTITY(1,1),
    sample_id   BIGINT        NOT NULL REFERENCES collected_samples(id),
    user_id     NVARCHAR(50)  NOT NULL REFERENCES users(id),
    is_correct  BIT           NOT NULL,
    user_label  NVARCHAR(100),
    comment     NVARCHAR(500),
    created_at  DATETIME2     NOT NULL DEFAULT GETUTCDATE()
);

-- ── 8. CARE SCHEDULES (giai đoạn 2) ─────────────────────────────
CREATE TABLE care_schedules (
    id              INT           PRIMARY KEY IDENTITY(1,1),
    user_plant_id   INT           NOT NULL REFERENCES user_plants(id),
    care_type       NVARCHAR(50)  NOT NULL,
    -- 'watering' | 'fertilizing' | 'pruning' | 'repotting' | 'misting' | 'rotating'
    frequency_days  INT           NOT NULL,        -- Tần suất (ngày)
    next_due_at     DATETIME2     NOT NULL,        -- Lần tiếp theo
    last_done_at    DATETIME2,
    reminder_time   TIME,                          -- VD: 08:00
    is_active       BIT           NOT NULL DEFAULT 1,
    notes           NVARCHAR(200),
    created_at      DATETIME2     NOT NULL DEFAULT GETUTCDATE()
);

CREATE INDEX idx_care_schedules_due ON care_schedules(next_due_at, is_active);

-- ── 9. CARE LOGS (lịch sử chăm sóc) ────────────────────────────
CREATE TABLE care_logs (
    id              INT           PRIMARY KEY IDENTITY(1,1),
    schedule_id     INT           REFERENCES care_schedules(id),
    user_plant_id   INT           NOT NULL REFERENCES user_plants(id),
    user_id         NVARCHAR(50)  NOT NULL REFERENCES users(id),
    care_type       NVARCHAR(50)  NOT NULL,
    done_at         DATETIME2     NOT NULL DEFAULT GETUTCDATE(),
    notes           NVARCHAR(300),
    photo_url       NVARCHAR(500)
);

-- ── 10. CHAT SESSIONS (giai đoạn 3) ─────────────────────────────
CREATE TABLE chat_sessions (
    id              BIGINT        PRIMARY KEY IDENTITY(1,1),
    user_id         NVARCHAR(50)  NOT NULL REFERENCES users(id),
    user_plant_id   INT           REFERENCES user_plants(id),
    -- Nếu chat gắn với 1 cây cụ thể
    context_type    NVARCHAR(30)  NOT NULL DEFAULT 'general',
    -- 'general' | 'diagnosis' | 'care_advice' | 'product_recommend'
    title           NVARCHAR(200),                 -- Tự tóm tắt từ tin nhắn đầu
    is_active       BIT           NOT NULL DEFAULT 1,
    created_at      DATETIME2     NOT NULL DEFAULT GETUTCDATE(),
    last_message_at DATETIME2
);

-- ── 11. CHAT MESSAGES ───────────────────────────────────────────
CREATE TABLE chat_messages (
    id              BIGINT        PRIMARY KEY IDENTITY(1,1),
    session_id      BIGINT        NOT NULL REFERENCES chat_sessions(id),
    role            NVARCHAR(10)  NOT NULL,
    -- 'user' | 'assistant'
    content         NVARCHAR(MAX) NOT NULL,
    token_count     INT,                           -- Theo dõi chi phí
    model_used      NVARCHAR(50),                  -- 'gemini-1.5-flash'
    created_at      DATETIME2     NOT NULL DEFAULT GETUTCDATE()
);

CREATE INDEX idx_chat_messages_session ON chat_messages(session_id, created_at);

-- ── 12. PRODUCT CATEGORIES (giai đoạn 4) ────────────────────────
CREATE TABLE product_categories (
    id          INT           PRIMARY KEY IDENTITY(1,1),
    name_vi     NVARCHAR(100) NOT NULL,
    name_en     NVARCHAR(100) NOT NULL,
    slug        NVARCHAR(100) NOT NULL UNIQUE,
    -- 'fertilizer' | 'pesticide' | 'fungicide' | 'soil' | 'tool'
    description NVARCHAR(300),
    is_active   BIT           NOT NULL DEFAULT 1
);

-- ── 13. PRODUCTS ────────────────────────────────────────────────
CREATE TABLE products (
    id              INT           PRIMARY KEY IDENTITY(1,1),
    category_id     INT           NOT NULL REFERENCES product_categories(id),
    name            NVARCHAR(200) NOT NULL,
    brand           NVARCHAR(100),
    description     NVARCHAR(1000),
    usage_guide     NVARCHAR(1000),
    price           DECIMAL(10,2),
    affiliate_url   NVARCHAR(500),
    image_url       NVARCHAR(500),
    is_active       BIT           NOT NULL DEFAULT 1,
    created_at      DATETIME2     NOT NULL DEFAULT GETUTCDATE()
);

-- ── 14. PRODUCT — DISEASE MAPPING (sản phẩm nào trị bệnh nào) ───
CREATE TABLE product_disease_mappings (
    product_id  INT NOT NULL REFERENCES products(id),
    disease_id  INT NOT NULL REFERENCES plant_diseases(id),
    priority    INT NOT NULL DEFAULT 1,            -- 1 = gợi ý trước nhất
    notes       NVARCHAR(200),
    PRIMARY KEY (product_id, disease_id)
);

-- ── 15. TRAINING BATCHES (theo dõi train model) ──────────────────
CREATE TABLE training_batches (
    id               INT          PRIMARY KEY IDENTITY(1,1),
    started_at       DATETIME2,
    finished_at      DATETIME2,
    status           NVARCHAR(20) NOT NULL DEFAULT 'pending',
    -- 'pending' | 'running' | 'completed' | 'failed'
    total_samples    INT,
    num_classes      INT,
    val_accuracy     FLOAT,
    test_accuracy    FLOAT,
    epochs_run       INT,
    onnx_model_path  NVARCHAR(500),
    labels_json_path NVARCHAR(500),
    notes            NVARCHAR(500),
    created_at       DATETIME2    NOT NULL DEFAULT GETUTCDATE()
);

-- ── 16. MODEL DEPLOYMENTS (A/B test) ────────────────────────────
CREATE TABLE model_deployments (
    id                INT          PRIMARY KEY IDENTITY(1,1),
    training_batch_id INT          REFERENCES training_batches(id),
    deployed_at       DATETIME2,
    retired_at        DATETIME2,
    traffic_percent   INT          NOT NULL DEFAULT 0,
    is_active         BIT          NOT NULL DEFAULT 0,
    notes             NVARCHAR(200)
);
```

### Seed data

```sql
-- Loài cây cảnh phổ biến
INSERT INTO plant_types (name_vi, name_en, name_science, category) VALUES
('Monstera',        'Monstera',     'Monstera deliciosa',       'indoor'),
('Dương xỉ',        'Fern',         'Nephrolepis exaltata',     'indoor'),
('Trầu bà',         'Pothos',       'Epipremnum aureum',        'indoor'),
('Kim tiền',        'ZZ Plant',     'Zamioculcas zamiifolia',   'indoor'),
('Lan ý',           'Peace Lily',   'Spathiphyllum wallisii',   'indoor'),
('Xương rồng',      'Cactus',       'Cactaceae',                'indoor'),
('Sen đá',          'Succulent',    'Crassulaceae',             'indoor');

-- Bệnh cây
INSERT INTO plant_diseases (name_vi, name_en, slug, cause, severity_default) VALUES
('Khỏe mạnh',   'Healthy',          'healthy',          NULL,                           'low'),
('Đốm lá',      'Leaf spot',        'leaf-spot',        'Nấm Cercospora, Alternaria',   'medium'),
('Thối rễ',     'Root rot',         'root-rot',         'Nấm Pythium, tưới quá nhiều', 'high'),
('Phấn trắng',  'Powdery mildew',   'powdery-mildew',   'Nấm Erysiphe, độ ẩm cao',     'medium'),
('Vàng lá',     'Yellowing',        'yellowing',        'Thiếu dinh dưỡng hoặc úng nước','low'),
('Cháy lá',     'Leaf scorch',      'leaf-scorch',      'Nắng trực tiếp, thiếu nước',  'medium'),
('Rệp sáp',     'Mealybugs',        'mealybugs',        'Côn trùng Pseudococcidae',     'medium'),
('Nhện đỏ',     'Spider mites',     'spider-mites',     'Nhện Tetranychus urticae',     'medium');

-- Loại chăm sóc (dùng cho care_schedules.care_type)
-- Không cần bảng riêng vì dùng entity thay enum — lưu trực tiếp string có nghĩa
-- 'watering' | 'fertilizing' | 'pruning' | 'repotting' | 'misting' | 'rotating'

-- Danh mục sản phẩm
INSERT INTO product_categories (name_vi, name_en, slug) VALUES
('Phân bón',            'Fertilizer',   'fertilizer'),
('Thuốc trừ sâu',       'Pesticide',    'pesticide'),
('Thuốc trừ nấm',       'Fungicide',    'fungicide'),
('Đất trồng',           'Soil',         'soil'),
('Dụng cụ chăm sóc',    'Tools',        'tool');
```

---

## Giai đoạn 1 — MVP Chẩn đoán bệnh

### Domain Entity

```csharp
// DeskBoost.Domain/Entities/CollectedSample.cs
public class CollectedSample
{
    public long   Id                 { get; private set; }
    public string ImagePath          { get; private set; }
    public string ImageHash          { get; private set; }
    public string? UserId            { get; private set; }
    public int?   UserPlantId        { get; private set; }
    public string? PlantTypeRaw      { get; private set; }

    // Plant.id result
    public string? PlantidDisease    { get; private set; }
    public float?  PlantidConfidence { get; private set; }
    public bool?   PlantidIsHealthy  { get; private set; }
    public string? PlantidRawJson    { get; private set; }

    // Gemini result
    public string? GeminiSeverity    { get; private set; }
    public string? GeminiCause       { get; private set; }
    public string? GeminiTreatment   { get; private set; }
    public string? GeminiPrevention  { get; private set; }

    // Label status
    public string  LabelStatus       { get; private set; } = "pending";
    public string? ConfirmedLabel    { get; private set; }
    public bool    IsUsedInTraining  { get; private set; }

    public string  Source            { get; private set; } = "web";
    public DateTime CreatedAt        { get; private set; }

    // Navigation
    public User?       User       { get; private set; }
    public UserPlant?  UserPlant  { get; private set; }
    public PlantType?  PlantType  { get; private set; }

    // Factory method
    public static CollectedSample Create(
        string imagePath, string imageHash,
        string? userId, string? plantTypeRaw, string source = "web")
        => new()
        {
            ImagePath    = imagePath,
            ImageHash    = imageHash,
            UserId       = userId,
            PlantTypeRaw = plantTypeRaw,
            Source       = source,
            CreatedAt    = DateTime.UtcNow
        };

    public void SetPlantIdResult(string disease, float confidence,
        bool isHealthy, string rawJson)
    {
        PlantidDisease    = disease;
        PlantidConfidence = confidence;
        PlantidIsHealthy  = isHealthy;
        PlantidRawJson    = rawJson;
        LabelStatus       = confidence >= 0.85f ? "auto_approved" : "pending";
        if (LabelStatus == "auto_approved") ConfirmedLabel = disease;
    }

    public void SetGeminiResult(string severity, string cause,
        string treatment, string prevention)
    {
        GeminiSeverity   = severity;
        GeminiCause      = cause;
        GeminiTreatment  = treatment;
        GeminiPrevention = prevention;
    }

    public void ConfirmLabel(string label, string confirmedByUserId)
    {
        ConfirmedLabel      = label;
        LabelStatus         = "confirmed";
    }
}
```

### Application Interface

```csharp
// DeskBoost.Application/Common/Interfaces/AI/IDiagnosisOrchestrator.cs
public interface IDiagnosisOrchestrator
{
    Task<DiagnosisResult> DiagnoseAsync(
        Stream imageStream,
        string? userId,
        string? plantTypeHint,
        CancellationToken ct = default);
}

// DeskBoost.Application/Common/Models/DiagnosisResult.cs
public record DiagnosisResult
{
    public bool    Success         { get; init; }
    public long?   SampleId        { get; init; }
    public string? Disease         { get; init; }
    public string? DiseaseVi       { get; init; }
    public float   Confidence      { get; init; }
    public bool    IsHealthy       { get; init; }
    public string? Severity        { get; init; }
    public string? Cause           { get; init; }
    public string? Treatment       { get; init; }
    public string? Prevention      { get; init; }
    public string? Message         { get; init; }   // Khi Success = false
    public string  Source          { get; init; } = "plantid_api";
    public int     ProcessingMs    { get; init; }
    public List<TopPrediction> TopPredictions { get; init; } = [];
}
```

### CQRS Command

```csharp
// DeskBoost.Application/Features/Diagnosis/Commands/DiagnosePlant/
// DiagnosePlantCommand.cs
public record DiagnosePlantCommand : IRequest<DiagnosisResult>
{
    public required Stream ImageStream  { get; init; }
    public string?  PlantTypeHint       { get; init; }
    public int?     UserPlantId         { get; init; }
    public string?  UserId              { get; init; }
    public string   Source              { get; init; } = "web";
}

// DiagnosePlantCommandHandler.cs
public class DiagnosePlantCommandHandler
    : IRequestHandler<DiagnosePlantCommand, DiagnosisResult>
{
    private readonly IDiagnosisOrchestrator _orchestrator;
    private readonly IAppDbContext          _db;
    private readonly IBlobStorageService    _storage;

    public DiagnosePlantCommandHandler(
        IDiagnosisOrchestrator orchestrator,
        IAppDbContext db,
        IBlobStorageService storage)
    {
        _orchestrator = orchestrator;
        _db           = db;
        _storage      = storage;
    }

    public async Task<DiagnosisResult> Handle(
        DiagnosePlantCommand request, CancellationToken ct)
    {
        var sw = Stopwatch.StartNew();

        // 1. Upload ảnh lên blob storage
        var imageBytes = await ReadToBytes(request.ImageStream);
        var imageHash  = ComputeMd5(imageBytes);
        var imagePath  = await _storage.UploadAsync(
            imageBytes, $"samples/{imageHash}.jpg", ct);

        // 2. Gọi orchestrator (Plant.id → Gemini)
        var ms    = new MemoryStream(imageBytes);
        var result = await _orchestrator.DiagnoseAsync(
            ms, request.UserId, request.PlantTypeHint, ct);

        // 3. Lưu vào DB (background — không block response)
        if (result.SampleId is null)
        {
            _ = Task.Run(async () =>
            {
                var sample = CollectedSample.Create(
                    imagePath, imageHash, request.UserId,
                    request.PlantTypeHint, request.Source);

                if (result.Success)
                {
                    sample.SetPlantIdResult(
                        result.Disease!, result.Confidence,
                        result.IsHealthy, "{}");
                    if (result.Treatment is not null)
                        sample.SetGeminiResult(
                            result.Severity!, result.Cause!,
                            result.Treatment, result.Prevention!);
                }

                _db.CollectedSamples.Add(sample);
                await _db.SaveChangesAsync(CancellationToken.None);
            }, CancellationToken.None);
        }

        sw.Stop();
        return result with { ProcessingMs = (int)sw.ElapsedMilliseconds };
    }

    private static async Task<byte[]> ReadToBytes(Stream s)
    {
        using var ms = new MemoryStream();
        await s.CopyToAsync(ms);
        return ms.ToArray();
    }

    private static string ComputeMd5(byte[] data)
        => Convert.ToHexString(MD5.HashData(data)).ToLower();
}
```

### Infrastructure — Orchestrator

```csharp
// DeskBoost.Infrastructure/ExternalServices/Ai/DiagnosisOrchestrator.cs
public class DiagnosisOrchestrator : IDiagnosisOrchestrator
{
    private readonly IPlantIdService  _plantId;
    private readonly IGeminiService   _gemini;
    private readonly IOnnxModelService? _onnx;
    private readonly DiagnosisSettings _settings;

    public async Task<DiagnosisResult> DiagnoseAsync(
        Stream imageStream, string? userId,
        string? plantTypeHint, CancellationToken ct)
    {
        var imageBytes = await ReadToBytes(imageStream);
        var base64     = Convert.ToBase64String(imageBytes);

        // Chọn tầng 1: ONNX local (nếu bật) hoặc Plant.id API
        PlantIdResult t1;
        string source;

        if (_settings.UseOnnxModel && _onnx is not null)
        {
            t1     = await _onnx.PredictAsync(imageBytes, ct);
            source = "onnx_local";
        }
        else
        {
            t1     = await _plantId.AnalyzeAsync(base64, ct);
            source = "plantid_api";
        }

        // Confidence thấp → yêu cầu chụp lại
        if (t1.Confidence < _settings.ConfidenceThreshold)
            return new DiagnosisResult {
                Success    = false,
                Confidence = t1.Confidence,
                Message    = "Ảnh chưa đủ rõ, vui lòng chụp gần và đủ sáng hơn",
                Source     = source
            };

        // Tầng 2: Gemini tư vấn điều trị
        var advice = await _gemini.GetTreatmentAdviceAsync(
            base64, t1.TopDisease, t1.Confidence, plantTypeHint, ct);

        return new DiagnosisResult {
            Success    = true,
            Disease    = t1.TopDisease,
            Confidence = t1.Confidence,
            IsHealthy  = t1.IsHealthy,
            Severity   = advice.Severity,
            Cause      = advice.Cause,
            Treatment  = advice.Treatment,
            Prevention = advice.Prevention,
            Source     = source,
            TopPredictions = t1.TopPredictions
        };
    }
}
```

### API Controller

```csharp
// DeskBoost.API/Controllers/DiagnosisController.cs
[ApiController]
[Route("api/[controller]")]
public class DiagnosisController : ControllerBase
{
    private readonly ISender _sender;

    public DiagnosisController(ISender sender) => _sender = sender;

    /// POST /api/diagnosis
    [HttpPost]
    [DisableRequestSizeLimit]
    public async Task<IActionResult> Diagnose(
        [FromForm] IFormFile image,
        [FromForm] string?   plantTypeHint,
        [FromForm] int?      userPlantId,
        CancellationToken    ct)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var result = await _sender.Send(new DiagnosePlantCommand {
            ImageStream   = image.OpenReadStream(),
            PlantTypeHint = plantTypeHint,
            UserPlantId   = userPlantId,
            UserId        = userId,
            Source        = "web"
        }, ct);

        return Ok(result);
    }

    /// POST /api/diagnosis/{sampleId}/confirm
    [HttpPost("{sampleId:long}/confirm")]
    [Authorize]
    public async Task<IActionResult> Confirm(
        long sampleId,
        [FromBody] ConfirmDiagnosisLabelCommand command,
        CancellationToken ct)
    {
        var result = await _sender.Send(
            command with {
                SampleId = sampleId,
                UserId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            }, ct);
        return Ok(result);
    }
}
```

---

## Giai đoạn 2 — Nhắc lịch chăm sóc

### Luồng hoạt động

```
Người dùng tạo lịch (CreateCareSchedule)
    → Lưu CareSchedule với next_due_at
    → Background job chạy mỗi giờ (CareReminderJob)
        → Query care_schedules WHERE next_due_at <= NOW() AND is_active = 1
        → Gửi push notification / email
    → Người dùng xác nhận đã làm (LogCareActivity)
        → Lưu CareLog
        → Cập nhật next_due_at += frequency_days
```

### Background Job

```csharp
// DeskBoost.Infrastructure/BackgroundJobs/CareReminderJob.cs
public class CareReminderJob : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            var overdue = await _db.CareSchedules
                .Include(s => s.UserPlant).ThenInclude(p => p!.User)
                .Where(s => s.IsActive && s.NextDueAt <= DateTime.UtcNow)
                .ToListAsync(ct);

            foreach (var schedule in overdue)
                await _notification.SendCareReminderAsync(
                    schedule.UserPlant!.User!, schedule, ct);

            await Task.Delay(TimeSpan.FromHours(1), ct);
        }
    }
}
```

---

## Giai đoạn 3 — Chatbox AI

### Luồng hội thoại

```
User gửi tin nhắn (SendMessageCommand)
    → Load lịch sử chat của session (tối đa 20 tin nhắn gần nhất)
    → Xây system prompt với context:
        - Thông tin cây (nếu gắn với UserPlant)
        - Kết quả chẩn đoán gần nhất (nếu có)
        - Lịch chăm sóc sắp tới
    → Gọi Gemini với toàn bộ lịch sử
    → Lưu cả user message + assistant message
    → Trả về response (streaming nếu cần)
```

### Command Handler

```csharp
// DeskBoost.Application/Features/Chat/Commands/SendMessage/
public class SendMessageCommandHandler
    : IRequestHandler<SendMessageCommand, ChatMessageDto>
{
    public async Task<ChatMessageDto> Handle(
        SendMessageCommand request, CancellationToken ct)
    {
        // Load lịch sử (tối đa 20 tin nhắn)
        var history = await _db.ChatMessages
            .Where(m => m.SessionId == request.SessionId)
            .OrderByDescending(m => m.CreatedAt)
            .Take(20)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync(ct);

        // Xây context system prompt
        var systemPrompt = await BuildSystemPromptAsync(request, ct);

        // Gọi Gemini với full context
        var response = await _gemini.ChatAsync(
            systemPrompt, history, request.Content, ct);

        // Lưu cả 2 tin nhắn
        var userMsg = new ChatMessage {
            SessionId = request.SessionId,
            Role      = "user",
            Content   = request.Content
        };
        var assistantMsg = new ChatMessage {
            SessionId  = request.SessionId,
            Role       = "assistant",
            Content    = response.Content,
            TokenCount = response.TokenCount,
            ModelUsed  = response.Model
        };
        _db.ChatMessages.AddRange(userMsg, assistantMsg);
        await _db.SaveChangesAsync(ct);

        return new ChatMessageDto(assistantMsg);
    }

    private async Task<string> BuildSystemPromptAsync(
        SendMessageCommand req, CancellationToken ct)
    {
        var sb = new StringBuilder();
        sb.AppendLine("Bạn là chuyên gia tư vấn chăm sóc cây cảnh của DeskBoost.");
        sb.AppendLine("Trả lời bằng tiếng Việt, thân thiện và thực tế.");

        if (req.UserPlantId.HasValue)
        {
            var plant = await _db.UserPlants
                .Include(p => p.PlantType)
                .FirstOrDefaultAsync(p => p.Id == req.UserPlantId, ct);
            if (plant is not null)
                sb.AppendLine($"Người dùng đang hỏi về cây '{plant.Nickname ?? plant.PlantType?.NameVi}'.");
        }
        return sb.ToString();
    }
}
```

---

## Giai đoạn 4 — Giới thiệu sản phẩm

### Query gợi ý sản phẩm theo bệnh

```csharp
// DeskBoost.Application/Features/Products/Queries/GetProductsByDisease/
public class GetProductsByDiseaseQueryHandler
    : IRequestHandler<GetProductsByDiseaseQuery, List<ProductDto>>
{
    public async Task<List<ProductDto>> Handle(
        GetProductsByDiseaseQuery request, CancellationToken ct)
    {
        return await _db.ProductDiseaseMappings
            .Include(m => m.Product).ThenInclude(p => p.Category)
            .Where(m => m.Disease.Slug == request.DiseaseSlug
                     && m.Product.IsActive)
            .OrderBy(m => m.Priority)
            .Select(m => new ProductDto(m.Product))
            .ToListAsync(ct);
    }
}
```

---

## Dependency Injection

```csharp
// DeskBoost.Infrastructure/DependencyInjection.cs
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration config)
    {
        // Database
        services.AddDbContext<AppDbContext>(o =>
            o.UseSqlServer(config.GetConnectionString("Default")));
        services.AddScoped<IAppDbContext>(p =>
            p.GetRequiredService<AppDbContext>());

        // AI Services
        services.AddHttpClient<IPlantIdService, PlantIdService>();
        services.AddHttpClient<IGeminiService,  GeminiService>();
        services.AddSingleton<ImagePreprocessor>();

        // ONNX (chỉ khởi tạo khi bật)
        if (config.GetValue<bool>("Diagnosis:UseOnnxModel"))
            services.AddSingleton<IOnnxModelService, OnnxModelService>();

        // Orchestrator
        services.AddScoped<IDiagnosisOrchestrator, DiagnosisOrchestrator>();

        // Storage
        services.AddSingleton<IBlobStorageService, AzureBlobStorageService>();

        // Background Jobs
        services.AddHostedService<CareReminderJob>();

        // Cache
        services.AddMemoryCache();

        // Settings
        services.Configure<DiagnosisSettings>(
            config.GetSection("Diagnosis"));

        return services;
    }
}
```

---

## Biến môi trường

```json
// appsettings.json
{
  "ConnectionStrings": {
    "Default": "Server=localhost;Database=DeskBoost;User Id=sa;Password=...;"
  },
  "Diagnosis": {
    "ConfidenceThreshold": 0.60,
    "AutoApproveThreshold": 0.85,
    "UseOnnxModel": false,
    "OnnxModelPath": "wwwroot/models/plant_disease.onnx",
    "OnnxLabelsPath": "wwwroot/models/labels.json",
    "OnnxAbTestPercent": 0
  },
  "PlantId": {
    "ApiKey": "",
    "BaseUrl": "https://api.plant.id/v3"
  },
  "Gemini": {
    "ApiKey": "",
    "Model": "gemini-1.5-flash",
    "BaseUrl": "https://generativelanguage.googleapis.com/v1beta"
  },
  "AzureStorage": {
    "ConnectionString": "",
    "ContainerName": "plant-images"
  },
  "Jwt": {
    "Key": "",
    "Issuer": "DeskBoost",
    "Audience": "DeskBoostUsers",
    "ExpiryMinutes": 60
  }
}
```

---

## Roadmap

> Thứ tự ưu tiên: **Chẩn đoán bệnh → Chatbox AI → Nhắc lịch chăm sóc → Giới thiệu sản phẩm**
