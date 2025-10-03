// src/app/utils/pdfmake-wrapper.ts
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");

// On assigne les polices ici
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default pdfMake;
