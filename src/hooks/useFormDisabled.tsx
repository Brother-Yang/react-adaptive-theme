import { useCallback, useMemo } from 'react';
import { Form } from 'antd';
import type { FormInstance } from 'antd';

interface DynamicRule {
  deps: string[];
  rule: (values: Record<string, unknown>) => boolean;
}

export interface UseFormDisabledOptions {
  formDisabled?: boolean;
  disabledFields?: string[];
  editableFields?: string[];
  dynamicRules?: Record<string, DynamicRule>;
}

export const useFormDisabled = (form: FormInstance, options: UseFormDisabledOptions = {}) => {
  const {
    formDisabled = false,
    disabledFields = [],
    editableFields = [],
    dynamicRules = {},
  } = options;

  // ✅ 正确监听方式：监听整个表单
  const rawValues = Form.useWatch([], form);

  const allValues = useMemo(() => rawValues || {}, [rawValues]);

  const forceSet = useMemo(() => new Set(disabledFields), [disabledFields]);

  const editableSet = useMemo(() => new Set(editableFields), [editableFields]);

  const isDisabled = useCallback(
    (field: string) => {
      // 1️⃣ form整体禁用
      if (formDisabled) return true;

      // 2️⃣ dynamicRules 最高优先级
      const dynamic = dynamicRules[field];
      if (dynamic) {
        const result = dynamic.rule(allValues);

        if (result !== undefined) return result;
      }

      // 3️⃣ 白名单模式
      if (editableFields.length > 0) {
        return !editableSet.has(field);
      }

      // 4️⃣ 黑名单模式
      if (disabledFields.length > 0) {
        return forceSet.has(field);
      }

      return false;
    },
    [formDisabled, dynamicRules, allValues, editableFields, disabledFields, editableSet, forceSet],
  );

  return { isDisabled };
};
