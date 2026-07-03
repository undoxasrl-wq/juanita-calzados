import { supabase } from "./supabase";

export async function seedProducts() {
  

  const productos = [
    {
      nombre: "BOTA AURA CHOCOLATE",
      categoria: "Botas",
      precio_efectivo: 89000,
      precio_tarjeta: 115000,
      descripcion: "Bota Aura Chocolate",
      talles: ["36", "37", "39", "40"],
      imagenes: [],
    },
    {
      nombre: "BOTA TOKIO GAMUZA FLECOS",
      categoria: "Botas",
      precio_efectivo: 110000,
      precio_tarjeta: 145000,
      descripcion: "Bota Tokio Gamuza Flecos",
      talles: ["36", "37", "38", "39", "40"],
      imagenes: [],
    },
    {
      nombre: "TEXANA CATALEYA CUERO",
      categoria: "Texanas",
      precio_efectivo: 110000,
      precio_tarjeta: 140000,
      descripcion: "Texana Cataleya",
      talles: ["36", "37", "38", "39"],
      imagenes: [],
    },
    {
      nombre: "KALEI DOS EN UNO",
      categoria: "Botas",
      precio_efectivo: 135000,
      precio_tarjeta: 170000,
      descripcion: "Kalei Dos en Uno",
      talles: ["38", "39", "40"],
      imagenes: [],
    },
    {
      nombre: "JALEI CHOCOLATE",
      categoria: "Botas",
      precio_efectivo: 98000,
      precio_tarjeta: 128000,
      descripcion: "Jalei Chocolate",
      talles: ["36", "38", "39", "40"],
      imagenes: [],
    },
    {
      nombre: "BOTINETA ALDANA CUERO",
      categoria: "Botinetas",
      precio_efectivo: 115000,
      precio_tarjeta: 148000,
      descripcion: "Botineta Aldana Cuero",
      talles: ["36", "38", "39", "40"],
      imagenes: [],
    },
    {
      nombre: "BOTA ROSA CUERO",
      categoria: "Botas",
      precio_efectivo: 101000,
      precio_tarjeta: 126000,
      descripcion: "Bota Rosa Cuero",
      talles: ["37", "38", "39", "40"],
      imagenes: [],
    },
    {
      nombre: "BOTINETA HALCÓN CUERO",
      categoria: "Botinetas",
      precio_efectivo: 100000,
      precio_tarjeta: 125000,
      descripcion: "Botineta Halcón Cuero",
      talles: ["37", "38", "39", "40"],
      imagenes: [],
    },
    {
      nombre: "BOTINETA ORQUÍDEA CUERO",
      categoria: "Botinetas",
      precio_efectivo: 115000,
      precio_tarjeta: 148000,
      descripcion: "Botineta Orquídea Cuero",
      talles: ["36", "37", "38", "39", "40"],
      imagenes: [],
    },
    {
      nombre: "BOTA CHELSEA CUERO Y GAMUZA COMBINADA",
      categoria: "Botas",
      precio_efectivo: 104000,
      precio_tarjeta: 125000,
      descripcion: "Bota Chelsea Cuero y Gamuza Combinada",
      talles: ["36", "37", "39", "40"],
      imagenes: [],
    },
    {
      nombre: "BORCEGO ALANIA CUERO",
      categoria: "Borcegos",
      precio_efectivo: 90000,
      precio_tarjeta: 112000,
      descripcion: "Borcego Alania Cuero",
      talles: ["36", "37", "38", "39", "40"],
      imagenes: [],
    },
    {
      nombre: "TEXANA CLAVELINA CUERO",
      categoria: "Texanas",
      precio_efectivo: 116000,
      precio_tarjeta: 145000,
      descripcion: "Texana Clavelina Cuero",
      talles: ["36", "38", "39", "40"],
      imagenes: [],
    },
    {
      nombre: "BOTINETA REPTIL SUELA CUERO",
      categoria: "Botinetas",
      precio_efectivo: 96000,
      precio_tarjeta: 120000,
      descripcion: "Botineta Reptil Suela Cuero",
      talles: ["36", "37", "38", "39", "40"],
      imagenes: [],
    },
    {
      nombre: "TABBY TEXANA CUERO",
      categoria: "Texanas",
      precio_efectivo: 136000,
      precio_tarjeta: 170000,
      descripcion: "Tabby Texana Cuero",
      talles: ["36", "37", "38", "39", "40"],
      imagenes: [],
    },
    {
      nombre: "TEXANA TRINI CUERO",
      categoria: "Texanas",
      precio_efectivo: 136000,
      precio_tarjeta: 170000,
      descripcion: "Texana Trini Cuero",
      talles: ["35", "36", "37", "38", "39"],
      imagenes: [],
    },
    {
  nombre: "TEXANA TRINI CUERO",
  categoria: "Texanas",
  precio_efectivo: 136000,
  precio_tarjeta: 170000,
  descripcion: "Texana Trini Cuero",
  talles: ["35","36","37","38","39"],
  imagenes: [],
},

// 👇 PEGAR ACÁ LOS 5 PRODUCTOS

{
  nombre: "BOTINETA NUMA VISÓN CUERO",
  categoria: "Botinetas",
  precio_efectivo: 124000,
  precio_tarjeta: 155000,
  descripcion: "Botineta Numa Visón Cuero",
  talles: ["35","36","37","38","39","40"],
  imagenes: [],
},
{
  nombre: "BOTINETA NAOMI TRENCH CUERO",
  categoria: "Botinetas",
  precio_efectivo: 124000,
  precio_tarjeta: 155000,
  descripcion: "Botineta Naomi Trench Cuero",
  talles: ["35","36","37","38","39","40"],
  imagenes: [],
},
{
  nombre: "BOTA CARLA CUERO",
  categoria: "Botas",
  precio_efectivo: 120000,
  precio_tarjeta: 150000,
  descripcion: "Bota Carla Cuero",
  talles: ["37","39","40"],
  imagenes: [],
},
{
  nombre: "BOTA WENDY CUERO",
  categoria: "Botas",
  precio_efectivo: 120000,
  precio_tarjeta: 150000,
  descripcion: "Bota Wendy Cuero",
  talles: ["35","37","38","39","40"],
  imagenes: [],
},
{
  nombre: "BOTA VEGA CUERO COMBINADA CON GAMUZA",
  categoria: "Botas",
  precio_efectivo: 104000,
  precio_tarjeta: 130000,
  descripcion: "Bota Vega Cuero Combinada con Gamuza",
  talles: ["36","38","40"],
  imagenes: [],
}
    
    
    
  ];

  const { error } = await supabase.from("products").insert(productos);

  if (error) {
    alert(JSON.stringify(error, null, 2));
    console.error(error);
  } else {
    alert("Productos cargados correctamente");
  }
  
}
