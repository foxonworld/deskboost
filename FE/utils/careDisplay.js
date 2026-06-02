const careScaleKeys = {
  light: {
    '1': 'low',
    '2': 'indirect',
    '3': 'brightIndirect',
    '4': 'partialSun',
    '5': 'fullSun',
  },
  water: {
    '1/1': 'daily',
    '1/2': 'everyTwoDays',
    '1/3': 'everyThreeDays',
    '1/5': 'everyFiveDays',
    '1/7': 'weekly',
    '1/14': 'everyTwoWeeks',
  },
  care: {
    '1': 'veryEasy',
    '2': 'easy',
    '3': 'moderate',
    '4': 'hard',
    '5': 'expert',
  },
};

const normalizeCareValue = (value) => String(value ?? '').trim();

export const getCareScaleDisplay = (type, value, t) => {
  const rawValue = normalizeCareValue(value);
  if (!rawValue) return { value: '', hint: '' };

  const scaleKey = careScaleKeys[type]?.[rawValue];
  if (!scaleKey) return { value: rawValue, hint: '' };

  return {
    value: t(`careScale.${type}.${scaleKey}.label`),
    hint: t(`careScale.${type}.${scaleKey}.hint`, { value: rawValue }),
  };
};

