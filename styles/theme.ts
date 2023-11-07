import { darken, desaturate } from "polished";

export const defaultTheme = {
  default: {
    primary: "#2980B9",
    scondary: "#2FCC71",
    tertiary: "#FFC13D",
    lighten: "#FFF",
    grey: "#A3A3A3",
    grey_light: "#e5e5e5",
    darken: "#818181",
  },

  background: {
    default: "#fff",
    lighten: "#F7F7F7",
    primary: "#F5F5F5",
    secondary: "#dadada",
    drop: desaturate(0.4)("#2980B9"),
    login_gradient:
      "linear-gradient(142deg, rgba(0, 0, 0, 0) 16.85%, rgba(0, 0, 0, 0.06) 18.42%, rgba(15, 15, 15, 0.076313) 29.15%, rgba(0, 0, 0, 0) 32.93%, rgba(0, 0, 0, 0) 43.93%, rgba(0, 0, 0, 0.08) 43.94%, rgba(0, 0, 0, 0) 53.86%, rgba(0, 0, 0, 0.05) 59.33%, rgba(0, 0, 0, 0) 64.21%, rgba(0, 0, 0, 0) 67.18%, rgba(35, 35, 35, 0.111923) 69.18%, rgba(35, 35, 35, 0) 85.09%, rgba(8, 8, 8, 0) 91.89%), linear-gradient(180deg, #7DC6BD 0%, #70B3DC 50%)",
  },

  icons: {
    default: "#818181",
    disable: "#CBCBCB",
    highlight: "#2980B9",
    greenDark: "#7AD39F",
    primary: "#BADBF0",
    scondary: darken(0.05, "#B8EBCE"),
    tertiary: darken(0.05, "#FFEBBF"),
    alert: "#e74c3c",
  },

  text: {
    title: "#818181",
    link: "#2980B9",
    default: "#282a36",
    primary: "#333",
    secondary: "#818181",
    ligth: "#FFFFFF",
  },

  breaks: {
    mobile: { number: 375, max: "max-width: 375px", min: "min-width: 375px" },
    tablet: { number: 768, max: "max-width: 768px", min: "min-width: 768px" },
    landscape: {
      number: 1024,
      max: "max-width:  1024px",
      min: "min-width:  1024px",
    },
    notebook: {
      number: 1210,
      max: "max-width:  1210px",
      min: "min-width:  1210px",
    },
  },
};
export const darkTheme = {
  default: {
    primary: "#2980B9",
    scondary: "#2FCC71",
    tertiary: "#FFC13D",
    lighten: "#2C3333",
    grey: "#A3A3A3",
    grey_light: "#395B64",
    darken: "#818181",
  },

  background: {
    default: "#2C3333",
    lighten: "#395B64",
    primary: "#395B64",
    secondary: "#dadada",
    drop: desaturate(0.4)("#2980B9"),
    login_gradient:
      "linear-gradient(142deg, rgba(0, 0, 0, 0) 16.85%, rgba(0, 0, 0, 0.06) 18.42%, rgba(15, 15, 15, 0.076313) 29.15%, rgba(0, 0, 0, 0) 32.93%, rgba(0, 0, 0, 0) 43.93%, rgba(0, 0, 0, 0.08) 43.94%, rgba(0, 0, 0, 0) 53.86%, rgba(0, 0, 0, 0.05) 59.33%, rgba(0, 0, 0, 0) 64.21%, rgba(0, 0, 0, 0) 67.18%, rgba(35, 35, 35, 0.111923) 69.18%, rgba(35, 35, 35, 0) 85.09%, rgba(8, 8, 8, 0) 91.89%), linear-gradient(180deg, #7DC6BD 0%, #70B3DC 50%)",
  },

  icons: {
    default: "#818181",
    disable: "#395B64",
    highlight: "#2980B9",
    greenDark: "#7AD39F",
    primary: "#395B64",
    scondary: darken(0.05, "#B8EBCE"),
    tertiary: darken(0.05, "#FFEBBF"),
    alert: "#e74c3c",
  },

  text: {
    title: "#E7F6F2",
    link: "#2980B9",
    default: "#E7F6F2",
    primary: "#A5C9CA",
    secondary: "#A5C9CA",
    ligth: "#2C3333",
  },

  breaks: {
    mobile: { number: 375, max: "max-width: 375px", min: "min-width: 375px" },
    tablet: { number: 768, max: "max-width: 768px", min: "min-width: 768px" },
    landscape: {
      number: 1024,
      max: "max-width:  1024px",
      min: "min-width:  1024px",
    },
    notebook: {
      number: 1210,
      max: "max-width:  1210px",
      min: "min-width:  1210px",
    },
  },
};
