import React from 'react';
import { Button, Dropdown, type MenuProps } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useAutoTranslation } from '../../hooks/useAutoTranslation';
import { supportedLanguages } from '../../config/i18n';
import './index.less';

/**
 * 语言切换组件
 * 支持多语言切换功能
 */
const LanguageToggle: React.FC = () => {
  const { i18n, tAuto } = useAutoTranslation();

  // 获取当前语言信息
  const currentLanguage = supportedLanguages.find(lang => lang.code === i18n.language) || supportedLanguages[0];

  // 切换语言
  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  // 生成下拉菜单项
  const menuItems: MenuProps['items'] = supportedLanguages.map(lang => ({
    key: lang.code,
    label: (
      <div className="language-item">
        <span className="language-name">{lang.name}</span>
        <span className="language-native">{lang.nativeName}</span>
      </div>
    ),
    onClick: () => changeLanguage(lang.code),
  }));

  return (
    <Dropdown
      menu={{ items: menuItems }}
      placement="bottomRight"
      trigger={['click']}
      arrow
    >
      <Button
        type="text"
        icon={<GlobalOutlined />}
        className="language-toggle"
        title={tAuto('切换语言')}
      >
        <span className="current-language">{currentLanguage.nativeName}</span>
      </Button>
    </Dropdown>
  );
};

export default LanguageToggle;