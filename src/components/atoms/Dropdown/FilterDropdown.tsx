import { styled, Box, ClickAwayListener, Checkbox } from "@mui/material";
import React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AppButton from "@/components/atoms/buttons/AppButton";
import { IDropdownType } from "@/types/interfaces/commonTypes/commonTypes";

type IProps = {
  placeholder: string;
  dropdownItems: IDropdownType[];
  defaultSelected: string[];
  onSubmitHandler: (arg: string[]) => void;
};

const StyledDropdownContainer = styled(Box)({
  position: "relative",
  height: "36px",
  padding: "8px 24px",
  fontSize: "14px",
  fontWeight: 700,
  lineHeight: "20px",
  color: "rgb(20, 48, 89)",
  backgroundColor: "rgb(255, 255, 255)",
  borderRadius: "50px",
  "& .placeholder-container": {
    cursor: "pointer",
  },
  "& .dropdown-item-container": {
    position: "absolute",
    borderRadius: "5px",
    color: "rgb(36, 31, 33)",
    background: "rgb(252, 252, 251)",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
    display: "block",
    boxSizing: "border-box",
    zIndex: 2122,
    top: "100%",
    marginTop: "4px",
    left: "0px",
    width: "max-content",
  },
  "& .dropdown-item-actions": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "8px",
    gap: "8px",
    borderTop: "1px solid #ddd",
  },
  "& .dropdown-items": {
    padding: "10px",
  },
  "& .item-total": {
    backgroundColor: "rgba(251, 169, 25, 0.8)",
    padding: "2px 6px",
    marginRight: "6px",
    borderRadius: "50%",
  },
});

const FilterDropdown = ({
  placeholder,
  dropdownItems,
  defaultSelected,
  onSubmitHandler,
}: IProps) => {
  const [toggleDropdown, setDropdown] = React.useState(false);
  const [filterCount, setFilterCount] = React.useState<number>(
    defaultSelected.length
  );
  const [selectedItems, setSelectedItems] =
    React.useState<string[]>(defaultSelected);

  React.useEffect(() => {
    setFilterCount(defaultSelected.length);
    setSelectedItems(defaultSelected);
  }, [defaultSelected]);

  const onResetHander = () => {
    if (selectedItems.length) {
      onSubmitHandler([]);
      setSelectedItems([]);
    } else setDropdown(false);
  };

  return (
    <StyledDropdownContainer>
      <div
        onClick={() => setDropdown((value) => !value)}
        className="placeholder-container"
      >
        {!!filterCount && <span className="item-total">{filterCount} </span>}
        {placeholder} <ArrowDropDownIcon />
      </div>
      {toggleDropdown && (
        <ClickAwayListener onClickAway={() => setDropdown(false)}>
          <div className="dropdown-item-container">
            <div className="dropdown-items">
              {dropdownItems.map((item) => (
                <div
                  key={`${
                    Number(Date.now()) * Math.floor(Math.random() * 999)
                  }`}
                >
                  <Checkbox
                    value={item.value}
                    checked={selectedItems.includes(item.value)}
                    onChange={(e) =>
                      setSelectedItems((value) => {
                        const targetValue = e.target.value;
                        const data = [...value];
                        const idx = data.findIndex(
                          (item) => item === targetValue
                        );
                        if (idx === -1) data.push(e.target.value);
                        else data.splice(idx, 1);
                        return data;
                      })
                    }
                  />
                  {item.text}
                </div>
              ))}
            </div>
            <div className="dropdown-item-actions">
              <AppButton variant="outlined" onClick={() => onResetHander()}>
                {" "}
                {selectedItems.length ? "Reset" : "Close"}
              </AppButton>
              <AppButton
                onClick={() => {
                  onSubmitHandler(selectedItems);
                  setDropdown(false);
                }}
                disabled={!selectedItems.length && !defaultSelected.length}
              >
                Apply
              </AppButton>
            </div>
          </div>
        </ClickAwayListener>
      )}
    </StyledDropdownContainer>
  );
};

export default FilterDropdown;
