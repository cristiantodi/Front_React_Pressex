import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./vfs_fonts.js";
import logo from "../../img/logo.png";
import bwipjs from "bwip-js";
import { BorderColor } from "@mui/icons-material";
import { blue } from "@mui/material/colors";

pdfMake.vfs = pdfFonts;

const GenerateReleasePDF = (data) => {
  const canvas = document.createElement("canvas");
  const barcodeImage = canvas.toDataURL();
  
  return new Promise((resolve, reject) => {
    let canvas = null;
    let barcodeImage = null;

// # Obtener la fecha y la hora por separado
let dataCreation = new Date(data.creation_date);
let year = dataCreation.getFullYear();
let month = String(dataCreation.getMonth() + 1).padStart(2, '0'); // Meses comienzan desde 0
let day = String(dataCreation.getDate()).padStart(2, '0');
let hours = dataCreation.getHours();
let minutes = String(dataCreation.getMinutes()).padStart(2, '0');

// Determinar AM o PM
let ampm = hours >= 12 ? 'Pm' : 'Am';

// Convertir horas de 24 horas a 12 horas
hours = hours % 12;
hours = hours ? hours : 12; // La hora 0 debería ser 12

// Formato: YYYY-MM-DD HH:MM AM/PM
let formattedDateTime = `${day}/${month}/${year} - ${hours}:${minutes} ${ampm}`;


    canvas = document.createElement('canvas');
    const barcodeOptions = {
      bcid: "code128", // Barcode type (e.g., code128)
      text: data.number + '', // Barcode data
      scale: 4, // Scale factor for the barcode size
      height: 5, // Height of the barcode
      includetext: true, // Include human-readable text below the barcode
      textxalign: "center",
    };
    try {
      canvas = bwipjs.toCanvas(canvas, barcodeOptions);
      barcodeImage = canvas.toDataURL();
    } catch (error) {
      reject(error);
    }
    const commodityRows = [];
    let totalPieces = 0;
    let totalWeight = 0.0;
    let totalVolume = 0.0;
    let totalVolumeM = 0.0;
    let hazardous = "";
    let hazardousAlert = "";
    let hazardous_type = ""
    let longboard = 420.0;

    if (data.commodities) {
      totalPieces = data.commodities.length;
      let firstRowText    = "";
      let secondRowText   = "";
      let thirdRowText    = "";
      let fourthRowText   = "";
      let fifthRowText    = "";
      let sixthRowText    = "";
      let seventhRowText  = "";
      let eigthRowText    = "";
      let ninenthRowText  = "";
      data.commodities?.forEach((commodity, index) => {
        firstRowText    += `1 \n`;
        secondRowText   = data.warehouseReceiptObj?.number || "";
        thirdRowText    += `${commodity.locationCode} \n`;
        fourthRowText   += `${commodity.length}x${commodity.width}x${commodity.height} in \n`;
        fifthRowText    += `${commodity.package_type_description} \n`;
        sixthRowText    += `${commodity.description} \n`;
        seventhRowText  += `${commodity.weight} lb \n`;
        eigthRowText    += `${commodity.volumen} ft3 \n`;
        ninenthRowText  += `${commodity.volumetricWeight} Vlb \n`;
        totalWeight     += parseFloat(commodity.weight);
        totalVolume     += parseFloat(commodity.volumen);
        totalVolumeM    += parseFloat(commodity.volumetricWeight);
        longboard       -= 21;

        hazardous       += `${commodity.hazardous}`;
        hazardous_type  += `${commodity.hazardous_type}`;

        if (hazardous=="true"){
          hazardousAlert = "HAZARDOUS MATERIAL";
        }
      });
      const commodityRow = [
        {
          text: firstRowText,
          alignment: "left",
          fontSize: 9,
        },
        {
          text: secondRowText,
          alignment: "left",
          fontSize: 9,
        },
        {
          text: thirdRowText,
          alignment: "left",
          fontSize: 9,
        },
        {
          text: fourthRowText,
          alignment: "left",
          fontSize: 9,
        },
        {
          text: fifthRowText,
          alignment: "left",
          fontSize: 9,
        },
        {
          text: sixthRowText,
          alignment: "left",
          fontSize: 9,
        },
        {
          text: seventhRowText,
          alignment: "right",
          fontSize: 9,
        },
        {
          text: eigthRowText,
          alignment: "right",
          fontSize: 9,
        },
        {
          text: ninenthRowText,
          margin: [0, 0, 0, longboard],
          fontSize: 9,
        },
      ];
      commodityRows.push(commodityRow);
    }
    const chargeRows = [];

    fetch(logo)
      .then((response) => response.blob())
      .then((imageBlob) => {

        const reader = new FileReader();
        reader.onload = (event) => {
          const imgUrl = event.target.result;


          const pdf = {
            content: [
              {
                table:{
                  widths: [`20%`, `50%`,`30%`],
                  body:[
                    [
                      {
                        border: ['', '', '', 'top'],
                        borderColor: ['#000000', '#000000', '#000000', '#006BAD'],
                        margin: [0, 0, 0, 0],
                        stack: [
                          {
                            image: imgUrl,
                            fit: [100, 100],
                          },
                        ],
                      },
                      {
                        border: ['', '', '', 'top'],
                        borderColor: ['#000000', '#000000', '#000000', '#006BAD'],
                        margin: [0, 0, 0, 0],
                        stack:[
                          {
                                  text: `${data.issued_byObj?.name || ``}`,
                                  margin: [0, 0, 0, 0],
                                  bold: true,
                                  fontSize: 12,
                                },
                                {
                                  text: `${data.issued_byObj?.street_and_number || ``}` + " , " +
                                        `${data.issued_byObj?.city || ``}`+ " , " + 
                                        `${data.issued_byObj?.state || ``}` + " , " +
                                        `${data.issued_byObj?.zip_code || ``}`,
                                  margin: [0, 0, 0, 0],
                                  fontSize: 9,
                                },
                                {
                                  text: `${data.issued_byObj?.country || ``}\n` +
                                        " Tel: " + `${data.issued_byObj?.phone || ``}\n` +
                                        " Fax: " + `${data.issued_byObj?.fax || ``} \n \n \n \n \n`,
                                  margin: [0, 0, 0, 0],
                                  fontSize: 9,
                                },
                                {
                                  text:"Released By",
                                  fontSize: 9,
                                },
                                {
                                  text:data.employeeObj.name,
                                  bold: true,
                                  fontSize: 11,
                                },
                        ]
                      },
                      {
                        border: ['', '', '', 'top'],
                        borderColor: ['#000000', '#000000', '#000000', '#006BAD'],
                        margin: [0, 0, 0, 0],
                        stack:[
                          [
                            {text: "CARGO RELEASE",
                            alignment: "center",
                            fontSize: 18,
                            border: ['', '', '', ''],
                            colSpan: 2,
                            bold: true,
                            margin: [0, 0, 0, 0],
                            }, 
                            {}
                          ],
                          [
                            {
                              border: ['', '', '', ''],
                              colSpan: 2,
                              stack: [
                                {
                                  image: barcodeImage,
                                  fit: [1000, 75],
                                  alignment: `center`,
                                },
                                {
                                  text: formattedDateTime,
                                  margin: [0, 12, 0, 0],
                                  fontSize: 12,
                                  alignment: "center",
                                  bold: true,
                                },
                              ],
                            },
                            {}
                          ],
                        ]
                      },
                    ],
                  ]
                }
              },
              // -------------------------
              {
                table:{
                  widths: [`20%`, `50%`,`30%`],
                  body:[
                    [
                      {
                        border: ['', '', '', ''],
                        margin: [0, 0, 0, 0],
                        stack:[
                          {
                            text: "Release to:",
                            margin: [0, 0, 0, 0],
                            fontSize: 9,
                          },
                          {
                            text: data.consigneeObj.data.obj.name,
                            margin: [0, 0, 0, 0],
                            bold: true,
                            fontSize: 11,
                          },
                        ],
                      },
                      {
                        border: ['', '', '', ''],
                        margin: [0, 0, 0, 0],
                        stack:[
                          {
                          text: "Carrier",
                          fontSize: 9,
                          },
                          {
                            text: data.inland_carrierObj.name,
                            fontSize: 11,
                            bold: true,
                            },
                          {
                          text: "Driver",
                          fontSize: 9,
                          },
                          {
                            text: "- - - - - - - - -",
                            fontSize: 11,
                            bold: true,
                            },
                          {
                          text: "Driver License",
                          fontSize: 9,
                          },
                          {
                            text: "- - - - - - - - -",
                            fontSize: 11,
                            bold: true,
                            },
                          {
                          text: "Pro Number",
                          fontSize: 9,
                          },
                          {
                            text: data.pro_number,
                            fontSize: 11,
                            bold: true,
                            },
                          {
                          text: "Tracking Number",
                          fontSize: 9,
                          },
                          {
                            text: data.tracking_number,
                            fontSize: 11,
                            bold: true,
                          },
                          {
                          text: hazardousAlert,
                          fontSize: 9,
                          },
                          {
                          text: hazardous_type,
                          fontSize: 11,
                          bold: true,
                          },
                        ],
                      },
                      {
                        border: ['', '', '', ''],
                        fillColor: `#CCCCCC`,
                        text: "Release to:",
                        margin: [0, 0, 0, 0],
                        fontSize: 9,
                      },
                    ],
                  ]
                }
              },
              {
                table: {
                  widths: ['5%', '9%', '11%', '13%', '12%', '20%', '9%', '11%', '11%'],
                  body: [
                    [
                      { text: 'Pcs',        fillColor: '#CCCCCC', alignment: 'center' },
                      { text: 'WHR No',     fillColor: '#CCCCCC', alignment: 'center' },
                      { text: 'Location',   fillColor: '#CCCCCC', alignment: 'center' },
                      { text: 'Dimensions', fillColor: '#CCCCCC', alignment: 'center' },
                      { text: 'Package',    fillColor: '#CCCCCC', alignment: 'center' },
                      { text: 'Description',fillColor: '#CCCCCC', alignment: 'center' },
                      { text: 'Weight',     fillColor: '#CCCCCC', alignment: 'center' },
                      { text: 'Volume',     fillColor: '#CCCCCC', alignment: 'center' },
                      { text: 'Vol Weight', fillColor: '#CCCCCC', alignment: 'center' }
                    ],
                    ...commodityRows,
                    [
                      { text: 'Note:',      colSpan: 5, rowSpan: 2, alignment: 'left' }, {}, {}, {}, {},
                      { text: 'Pieces',     alignment: 'center' },
                      { text: 'Weight',     alignment: 'center' },
                      { text: 'Volume',     alignment: 'center' },
                      { text: 'Vol Weight', alignment: 'center' }
                    ],
                    [
                      {}, {}, {}, {}, {},
                      { text: totalPieces, alignment: 'right' },
                      { text: `${(totalWeight).toFixed(2)} lb`, alignment: 'right' },
                      { text: `${totalVolume.toFixed(2)} ft3`, alignment: 'right' },
                      { text: `${totalVolumeM.toFixed(2)} Vlb`, alignment: 'right' }
                    ]
                  ]
                },
                margin: [0, 10, 0, 20]
              }
            ],
            styles: {
              header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 5],
              },
              subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5],
              },
              tableExample: {
                margin: [20, 20, 20, 5],
                alignment: `right`,
                width: `100%`,
              },
              tableExampleLeft: {
                margin: [0, 0, 0, 5],
                alignment: `left`,
                width: `100%`,
              },
              tableHeader: {
                bold: true,
                fontSize: 13,
                color: `black`,
              },
            },
            defaultStyle: {
              fontSize: 10, // Set the desired font size here (e.g., 10)
            },
          };


          const pdfGenerator = pdfMake.createPdf(pdf);
          pdfGenerator.getBlob((blob) => {
            const pdfUrl = URL.createObjectURL(blob);
            resolve(pdfUrl);
          });
        };
        reader.readAsDataURL(imageBlob); // Read the logo image
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default GenerateReleasePDF;
