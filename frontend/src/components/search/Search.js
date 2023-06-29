import React from "react";
import styles from "./Search.module.scss";
import { BiSearchAlt } from "react-icons/bi";

const Search = ({ value, onChange }) => {
  return (
    <div className={styles.search}>
      <BiSearchAlt size={18} className={styles.icon} />
      <input
        type="text"
        placeholder="Search Products"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Search;
