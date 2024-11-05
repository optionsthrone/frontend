import React, { useState, useEffect } from "react";
import Modal from "@/components/atoms/Modal";
import ModalBody from "@/components/atoms/Modal/ModalBody";
import ModalTitle from "@/components/atoms/Modal/ModalTitle";
import FormWrapper from "@/components/atoms/form/FormWrapper";
import { Box } from "@mui/material";
import FormLevelDropdown from "@/components/atoms/form/FormLevelDropdown";
import { useActions, useAppSelector } from "@/store/hooks";
import { useForm } from "react-hook-form";
import AppButton from "@/components/atoms/buttons/AppButton";
import FormLevelRadioGroup from "@/components/atoms/form/FormLevelRadioGroup";
import { constants } from "../gameConstants/constants";
import { useSendMessageMutation } from "@/store/api/socketApi";

type IAbilityType = {
  label: string;
  value: string;
};

const AbilityModal = () => {
  const { closeGameModal, setPlayerAbilitySelected } = useActions();
  const [sendMessage] = useSendMessageMutation();
  const { isOpen } = useAppSelector((state) => state.gameModal);
  const { corporations, roomCode, currentPhase } = useAppSelector(
    (state) => state.game.data
  );
  const userName = useAppSelector((state) => state.userInfo.userName);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const methods = useForm<any>();
  const { handleSubmit, watch } = methods;

  const [corporation, setCorporation] = useState<string>("");
  const [, setSelectedAbility] = useState<string>("");
  const [abilities, setAbilities] = useState<Array<IAbilityType>>([]);
  const [corpAvailabilityStatusText, setCorpAvailabilityStatusText] = useState<
    null | string
  >(null);

  useEffect(() => {
    if (currentPhase !== "Abilities") {
      closeGameModal();
    }
  }, [currentPhase]);

  const corporationsDropdownKeys =
    corporations &&
    Object.keys(corporations)
      .filter((corporation) => corporation !== "Global")
      .sort();
  const corporationsDropdownItems = corporationsDropdownKeys.map(
    (corporationItem) => ({
      keyName: corporationItem,
      keyValue: corporationItem,
    })
  );

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      const { corporation } = value;

      if (name === "corporation" && corporation) {
        setCorporation(corporation);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (corporation) {
      if (
        Object.keys(corporations[corporation]["abilities"]).some(
          (ability) =>
            corporations[corporation]["abilities"][ability]["status"] ===
            "Selected"
        )
      ) {
        setCorpAvailabilityStatusText(
          "An ability has already been selected for this corporation this turn"
        );
      } else if (
        Object.keys(corporations[corporation]["abilities"]).some(
          (ability) =>
            corporations[corporation]["abilities"][ability]["status"] ===
            "Available"
        )
      ) {
        setCorpAvailabilityStatusText("Abilities Available:");
      } else {
        setCorpAvailabilityStatusText("No abilities left");
      }

      const corpAbilities = corporations[corporation]["abilities"];
      const abilityArray: Array<IAbilityType> = [];

      Object.keys(corpAbilities).map((ability) => {
        if (corpAbilities[ability]["status"] === "Available") {
          abilityArray.push({
            label: ability,
            value: ability,
          });
        }
      });

      setAbilities(abilityArray);
    } else {
      setAbilities([]);
      setCorpAvailabilityStatusText(null);
    }
  }, [corporation, corporations]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAbility = (data: any) => {
    const { ability, corporation, direction } = data;
    const abilityRequest = {
      name: ability,
      corporation: corporation,
      direction: direction,
    };

    const payload = {
      abilityRequest: abilityRequest,
      roomCode: roomCode,
    };

    const action = constants.ability_action;
    sendMessage({ action, payload });
    setPlayerAbilitySelected(userName);

    setTimeout(() => {
      closeGameModal();
    }, 0);
  };

  const handleSelectedAbility = (selectedItem: string) => {
    if (selectedItem) {
      setSelectedAbility(selectedItem);
    }
  };

  // const handlePriceAction = (value: string) => {
  //   setSelectedButton(() => ({
  //     plus: value.includes("plus") ? true : false,
  //     minus: value.includes("minus") ? true : false,
  //   }));
  // };

  return (
    <Modal
      open={isOpen}
      onClose={() => closeGameModal()}
      maxWidth="sm"
      fullWidth
    >
      <ModalBody>
        <ModalTitle onClose={() => closeGameModal()}>Abilities</ModalTitle>
        <FormWrapper
          methods={methods}
          id="trade-form"
          onSubmit={handleSubmit(handleAbility)}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormLevelDropdown
              name="corporation"
              label="Corporation :"
              placeholder="Select corporation"
              dropDownItem={corporationsDropdownItems}
            />
          </Box>
          <Box>
            <h3
              style={{
                textAlign: "center",
                margin: "20px 0",
                fontWeight: "bold",
              }}
            >
              {corpAvailabilityStatusText}
            </h3>
            <FormLevelRadioGroup
              name={`ability`}
              radioGroups={abilities || []}
              isImageGroup={true}
              handleSelected={handleSelectedAbility}
            />
            {/* {selectedAbility === "Price Action" && (
              <StyledDirection>
                <h3 style={{ fontWeight: "bold", marginBottom: "20px" }}>
                  Direction:
                </h3>

                <StyledButtonGroup>
                  <StyledButton
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setValue("direction", "up");
                      handlePriceAction("plus");
                    }}
                    className={`${
                      selectedButton.plus ? "selected" : "unselected"
                    }`}
                  >
                    +10
                  </StyledButton>
                  <StyledButton
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setValue("direction", "down");
                      handlePriceAction("minus");
                    }}
                    className={`${
                      selectedButton.minus ? "selected" : "unselected"
                    }`}
                  >
                    -$10
                  </StyledButton>
                </StyledButtonGroup>
              </StyledDirection>
            )} */}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AppButton variant="contained" color="primary" type="submit">
              Use Ability
            </AppButton>
          </Box>
        </FormWrapper>
      </ModalBody>
    </Modal>
  );
};

export default AbilityModal;
