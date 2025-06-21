import React from "react";
import PropTypes from "prop-types";
import { LANGUAGE_VERSIONS } from "../constants";

const languages = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelector = (props) => {
  const { language, onSelect } = props;
  const handleChange = (event) => {
    onSelect(event.target.value);
  };

  return (
    <select
      value={language}
      onChange={handleChange}
      className="bg-gray-400  text-white-600 mb-5 text-lg px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {languages.map(([lang, version]) => (
        <option key={lang} value={lang}>
          {lang}({version})
        </option>
      ))}
    </select>
  );
};

LanguageSelector.propTypes = {
  language: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default LanguageSelector;
