import { it, expect, describe } from "vitest";

import * as VO from "../value-objects";
import { GoalVerifier, GoalConfigType } from "./goal-verifier";

describe("GoalVerifier", () => {
  describe("verify", () => {
    it("should return true for minimum goal when target is reached", () => {
      const config: GoalConfigType = {
        kind: VO.GoalKindEnum.minimum,
        target: VO.GoalTarget.parse(10),
      };
      const verifier = new GoalVerifier(config);

      const result = verifier.verify(VO.TrackerValue.parse(10));

      expect(result).toBe(true);
    });

    it("should return true for minimum goal when value is greater than target", () => {
      const config: GoalConfigType = {
        kind: VO.GoalKindEnum.minimum,
        target: VO.GoalTarget.parse(10),
      };
      const verifier = new GoalVerifier(config);

      const result = verifier.verify(VO.TrackerValue.parse(15));

      expect(result).toBe(true);
    });

    it("should return false for minimum goal when value is less than target", () => {
      const config: GoalConfigType = {
        kind: VO.GoalKindEnum.minimum,
        target: VO.GoalTarget.parse(10),
      };
      const verifier = new GoalVerifier(config);

      const result = verifier.verify(VO.TrackerValue.parse(5));

      expect(result).toBe(false);
    });

    it("should return true for maximum goal when target is reached", () => {
      const config: GoalConfigType = {
        kind: VO.GoalKindEnum.maximum,
        target: VO.GoalTarget.parse(100),
      };
      const verifier = new GoalVerifier(config);

      const result = verifier.verify(VO.TrackerValue.parse(100));

      expect(result).toBe(true);
    });

    it("should return true for maximum goal when value is less than target", () => {
      const config: GoalConfigType = {
        kind: VO.GoalKindEnum.maximum,
        target: VO.GoalTarget.parse(100),
      };
      const verifier = new GoalVerifier(config);

      const result = verifier.verify(VO.TrackerValue.parse(90));

      expect(result).toBe(true);
    });

    it("should return false for maximum goal when value is greater than target", () => {
      const config: GoalConfigType = {
        kind: VO.GoalKindEnum.maximum,
        target: VO.GoalTarget.parse(100),
      };
      const verifier = new GoalVerifier(config);

      const result = verifier.verify(VO.TrackerValue.parse(110));

      expect(result).toBe(false);
    });
  });
});
