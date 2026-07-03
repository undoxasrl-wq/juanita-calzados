import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

type UpdateItem = {
  nombre: string;
  imagenes: string[];
};

export const updates: UpdateItem[] = [
  {
    nombre: "BOTA AURA CHOCOLATE",
    imagenes: ["/bota-aura-chocolate.jpg", "/bota-aura-detalle.jpg"],
  },
  {
    nombre: "BOTA TOKIO GAMUZA FLECOS",
    imagenes: ["/bota-tokio-flecos.jpg", "/bota-tokio-lifestyle.jpg"],
  },
  {
    nombre: "TEXANA CATALEYA CUERO",
    imagenes: [
      "/texana-cataleya.jpg",
      "/texana-cataleya-new-1.jpg",
      "/texana-cataleya-new-2.jpg",
      "/texana-cataleya-new-3.jpg",
    ],
  },
  {
    nombre: "KALEI DOS EN UNO",
    imagenes: ["/kalei-dos-en-uno.jpg", "/kalei-alt.jpg"],
  },
  {
    nombre: "JALEI CHOCOLATE",
    imagenes: ["/jalei-chocolate.jpg", "/jalei-lifestyle.jpg"],
  },
  {
    nombre: "BOTINETA ALDANA CUERO",
    imagenes: ["/botineta-aldana-1.jpg", "/botineta-aldana-2.jpg"],
  },
  {
    nombre: "BOTA ROSA CUERO",
    imagenes: ["/bota-rosa-1.jpg", "/bota-rosa-2.jpg", "/bota-rosa-3.jpg"],
  },
  {
    nombre: "BOTINETA HALCÓN CUERO",
    imagenes: ["/botineta-halcon-1.jpg", "/botineta-halcon-2.jpg"],
  },
  {
    nombre: "BOTINETA ORQUÍDEA CUERO",
    imagenes: ["/botineta-orquidea-1.jpg", "/botineta-orquidea-2.jpg"],
  },
  {
    nombre: "BOTA CHELSEA CUERO Y GAMUZA COMBINADA",
    imagenes: ["/bota-chelsea-1.jpg", "/bota-chelsea-2.jpg", "/bota-chelsea-3.jpg"],
  },
  {
    nombre: "BORCEGO ALANIA CUERO",
    imagenes: ["/alania-borcego-1.jpg", "/alania-borcego-2.jpg", "/alania-borcego-3.jpg"],
  },
  {
    nombre: "TEXANA CLAVELINA CUERO",
    imagenes: ["/texana-cataleya-new-1.jpg", "/texana-cataleya-new-2.jpg"],
  },
  {
    nombre: "BOTINETA REPTIL SUELA CUERO",
    imagenes: ["/botineta-reptil-1.jpg", "/botineta-reptil-2.jpg"],
  },
  {
    nombre: "TABBY TEXANA CUERO",
    imagenes: ["/tabby-texana-1.jpg", "/tabby-texana-2.jpg"],
  },
  {
    nombre: "TEXANA TRINI CUERO",
    imagenes: ["/trini-texana-1.jpg", "/trini-texana-2.jpg", "/trini-texana-3.jpg"],
  },
  {
    nombre: "BOTINETA NUMA VISÓN CUERO",
    imagenes: ["/numa-1.jpg", "/numa-2.jpg", "/numa-3.jpg"],
  },
  {
    nombre: "BOTINETA NAOMI TRENCH CUERO",
    imagenes: ["/naomi-1.jpg", "/naomi-2.jpg", "/naomi-3.jpg"],
  },
  {
    nombre: "BOTA CARLA CUERO",
    imagenes: ["/carla-1.jpg", "/carla-2.jpg", "/carla-3.jpg"],
  },
  {
    nombre: "BOTA WENDY CUERO",
    imagenes: ["/wendy-1.jpg", "/wendy-2.jpg", "/wendy-3.jpg"],
  },
  {
    nombre: "BOTA VEGA CUERO COMBINADA CON GAMUZA",
    imagenes: ["/vega-1.jpg", "/vega-2.jpg", "/vega-3.jpg"],
  },
];

export async function updateProductImages(): Promise<void> {
  let updatedCount = 0;
  const { supabase } = await import("./supabase");

  for (const item of updates) {
    try {
      const { data, error } = await supabase
        .from("products")
        .update({ imagenes: item.imagenes })
        .eq("nombre", item.nombre);

      if (error) {
        console.error(`Error updating "${item.nombre}":`, error.message);
        continue;
      }

      if (!error) {
        console.log(`Updated "${item.nombre}" with ${item.imagenes.length} images.`);
      } else {
        console.warn(`No product matched "${item.nombre}" or nothing was changed.`);
      }
    } catch (err) {
      console.error(`Exception updating "${item.nombre}":`, err);
    }
  }

  console.log(`Finished updates: ${updatedCount}/${updates.length} products updated.`);
}

updateProductImages()
  .then(() => {
    console.log("✅ Imágenes actualizadas correctamente.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
