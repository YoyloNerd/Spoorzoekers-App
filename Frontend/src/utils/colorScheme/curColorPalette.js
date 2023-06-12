export default function curColorPalette() {
    let palette = ""
    try {
        palette = require(`./${localStorage.getItem("colorPalette")}.json`);
    } catch (err) {
        palette = require(`./default.json`);
        localStorage.setItem("colorPalette", "default");
    }
    return {
        "primary": palette.primary,
        "secondary": palette.secondary,
        "tertiary": palette.tertiary,
        "quaternary": palette.quaternary,
        "background": palette.background,
        "border": palette.border,
        "chevron": palette.chevron,
        "textTitle": palette.textTitle,
        "textPrimary": palette.textPrimary,
        "error": palette.error,
        "nav": palette.nav,
        "white": "#FFFFFF",
        "Expire": {
            "later": palette.secondary,
            "soon": "#FFC933",
            "today": "#DD595E",
        },
        "spacing": 3
    }
}