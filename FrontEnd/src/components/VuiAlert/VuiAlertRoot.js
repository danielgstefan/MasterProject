export default styled(Box)(({ theme, ownerState }) => {
  const { palette, typography, borders, functions } = theme;
  const { color } = ownerState;

  const { white, alertColors } = palette;
  const { fontSizeRegular, fontWeightMedium } = typography;
  const { borderWidth, borderRadius } = borders;
  const { pxToRem, linearGradient } = functions;

  const fallbackColor = alertColors?.info || {
    main: "#2152ff",
    state: "#02c6f3",
    border: "#b9ecf8",
  };

  const resolvedColor = alertColors?.[color] || fallbackColor;

  const backgroundImageValue = linearGradient(resolvedColor.main, resolvedColor.state);
  const borderValue = `${borderWidth[1]} solid ${resolvedColor.border}`;

  return {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: pxToRem(60),
    backgroundImage: backgroundImageValue,
    color: white.main,
    position: "relative",
    padding: pxToRem(16),
    marginBottom: pxToRem(16),
    border: borderValue,
    borderRadius: borderRadius.md,
    fontSize: fontSizeRegular,
    fontWeight: fontWeightMedium,
  };
});
