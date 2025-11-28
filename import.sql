-- =============================================
-- SCRIPT DE POBLAMIENTO - HAZELLAB DATABASE
-- =============================================

-- Limpiar tablas existentes (opcional)
-- DELETE FROM item_carrito;
-- DELETE FROM producto;
-- DELETE FROM categoria;
-- DELETE FROM usuario;

-- Insertar usuarios con contraseñas válidas para "admin123"
INSERT INTO usuario (username, email, rut, password, role, status, created_at) 
VALUES ('Superadmin', 'admin@duoc.cl', '12.345.678-9', '$2a$10$WMfSfMUhjJcqCxMUP6Liru7a1np4XeymNGMFbmsXzl1gDeweluDOq', 'admin', 'activo', NOW());

-- Insertar categorías
INSERT INTO categoria (id, nombre) VALUES
(1, 'Pastelería'),
(2, 'Cocina'),
(3, 'Bebidas y Lácteos'),
(4, 'Químicos'),
(5, 'Equipamiento'),
(6, 'Kits'),
(7, 'Muestras'),
(8, 'Ingredientes'),
(9, 'Envases'),
(10, 'Temporada');

-- Insertar productos de Pastelería (categoria_id = 1)
INSERT INTO producto (name, batch_code, description, chem_code, exp_date, elab_date, cost, stock, stock_critico, proveedor, categoria_id, image, active_status, creation_date, destacado) VALUES
('Harina Selecta Panadera Premium', 'LOT-PST-001', 'Harina de alta calidad especial para panificación y repostería. Ideal para panes y tortas.', NULL, '2024-08-15', '2024-02-15', 2800, 150, 20, 'Molinos San Juan', 1, 'https://www.harinaselecta.cl/img/productos/harina-panaderia-levadura.webp', true, NOW(), true),
('Mantequilla Colún Sin Sal 500g', 'LOT-PST-002', 'Mantequilla premium sin sal para repostería profesional. Textura cremosa y sabor neutro.', NULL, '2024-09-10', '2024-03-10', 4500, 80, 15, 'Lácteos Colún', 1, 'https://cdnx.jumpseller.com/comercial-maldonado/image/60204455/resize/610/610?1739617893', true, NOW(), true),
('Azúcar Flor Iansa 1kg', 'LOT-PST-003', 'Azúcar finamente molida ideal para decoración de tortas, glasés y coberturas.', NULL, '2024-09-05', '2024-03-05', 1800, 200, 30, 'Iansa', 1, 'https://unimarc.vtexassets.com/arquivos/ids/224418/000000000000880880-UN-01.jpg?v=637818241554170000', true, NOW(), true),
('Esencia de Vainilla Natural Gourmet 100ml', 'LOT-PST-004', 'Extracto puro de vainilla natural concentrado para uso profesional.', NULL, '2024-07-20', '2024-01-20', 8900, 45, 8, 'Esencias Premium', 1, 'https://santaisabel.vtexassets.com/arquivos/ids/465740/Esencia-de-Vainilla-Gourmet-Botella-100-cc.jpg?v=638690845370070000', true, NOW(), true),
('Chocolate Costa Cobertura Negra 70% 1kg', 'LOT-PST-005', 'Chocolate de cobertura con 70% de cacao. Ideal para templar y repostería profesional.', NULL, '2024-09-12', '2024-03-12', 12500, 60, 10, 'Chocolates Costa', 1, 'https://cdnx.jumpseller.com/insumitus/image/59055157/resize/540/540?1736769253', true, NOW(), true), 
('Polvos de Hornear Calo 500g', 'LOT-PST-006', 'Levadura química de acción doble para repostería. Garantiza un leudado perfecto.', NULL, '2024-08-30', '2024-02-28', 3200, 120, 25, 'Calo', 1, NULL, true, NOW(), false),
('Crema Soprole para Batir 1L', 'LOT-PST-007', 'Crema UHT con 35% de grasa. Ideal para chantilly y repostería.', NULL, '2024-09-14', '2024-03-14', 4800, 60, 12, 'Soprole', 1, NULL, true, NOW(), false),
('Gelatina Sin Sabor en Polvo 1kg', 'LOT-PST-008', 'Gelatina neutra en polvo de alta gelificación. 240 bloom.', NULL, '2024-08-08', '2024-02-08', 15600, 35, 6, 'Gelificantes Pro', 1, NULL, true, NOW(), false),
('Almendras Fileteadas Importadas 500g', 'LOT-PST-009', 'Almendras fileteadas y tostadas, perfectas para repostería.', NULL, '2024-09-07', '2024-03-07', 9200, 45, 8, 'Frutos Secos Premium', 1, NULL, true, NOW(), false),
('Huevos en Polvo Pasteurizados 1kg', 'LOT-PST-010', 'Huevo entero en polvo pasteurizado. Equivale a 80 huevos frescos.', NULL, '2024-08-16', '2024-02-16', 18900, 20, 3, 'Ovoproductos SA', 1, NULL, true, NOW(), false),
('Fondant Blanco Listo 1kg', 'LOT-PST-011', 'Pasta de azúcar lista para usar. Textura suave y maleable.', NULL, '2024-09-09', '2024-03-09', 7800, 30, 5, 'Decoración Dulce', 1, NULL, true, NOW(), false),
('Cacao en Polvo Alcalinizado 500g', 'LOT-PST-012', 'Cacao en polvo procesado. Color intenso y sabor profundo.', NULL, '2024-08-25', '2024-02-25', 6700, 75, 15, 'Cacao Import', 1, NULL, true, NOW(), false),
('Bicarbonato de Sodio 1kg', 'LOT-PST-013', 'Bicarbonato de sodio grado alimentario para repostería.', 'NaHCO3', '2024-09-01', '2024-03-01', 2400, 90, 18, 'Químicos Alimentarios', 1, NULL, true, NOW(), false),
('Mermelada de Frambuesa Sin Semillas 3kg', 'LOT-PST-014', 'Mermelada profesional con 65% de fruta. Sin semillas.', NULL, '2024-08-30', '2024-02-28', 14500, 25, 4, 'Conservas Artesanales', 1, NULL, true, NOW(), false),
('Colorante Alimentario Set 6 Colores', 'LOT-ESP-003', 'Set de 6 colorantes en gel concentrados: rojo, azul, amarillo, verde, naranja y rosa. 30ml cada uno.', 'E-COL-MIX', '2025-02-25', '2024-02-25', 12800, 40, 6, 'Colorantes Profesionales', 1, NULL, true, NOW(), false);

--Cocina
INSERT INTO producto (name, batch_code, description, chem_code, exp_date, elab_date, cost, stock, stock_critico, proveedor, categoria_id, image, active_status, creation_date, destacado) VALUES
('Aceite de Maravilla Chef 5L', 'LOT-COC-001', 'Aceite vegetal de maravilla, ideal para frituras y cocina en general.', NULL, '2025-02-20', '2024-02-20', 12500, 60, 10, 'Chef', 2, NULL, true, NOW(), false),
('Vinagre de Vino Tinto Gourmet 1L', 'LOT-COC-002', 'Vinagre de vino tinto de calidad premium, especial para ensaladas y cocina.', NULL, '2025-01-15', '2024-01-15', 2500, 40, 6, 'Gourmet', 2, NULL, true, NOW(), false),
('Mostaza Dijon Gourmet 250g', 'LOT-COC-003', 'Mostaza Dijon cremosa con sabor intenso, ideal para aderezos y salsas.', NULL, '2025-03-01', '2024-03-01', 1800, 70, 12, 'Gourmet', 2, NULL, true, NOW(), false),
('Mayonesa Hellmann''s 1kg', 'LOT-COC-004', 'Mayonesa clásica de textura cremosa y sabor equilibrado.', NULL, '2024-08-10', '2024-02-10', 3200, 55, 10, 'Unilever', 2, NULL, true, NOW(), false),
('Ketchup Carozzi 1kg', 'LOT-COC-005', 'Ketchup clásico con tomates seleccionados.', NULL, '2025-02-18', '2024-02-18', 2100, 65, 10, 'Carozzi', 2, NULL, true, NOW(), false),
('Salsa de Soya Kikkoman 1L', 'LOT-COC-006', 'Salsa de soya fermentada naturalmente, ideal para cocina asiática.', NULL, '2025-01-25', '2024-01-25', 5900, 30, 5, 'Kikkoman', 2, NULL, true, NOW(), false),
('Salsa de Ají Merkén Artesanal 250g', 'LOT-COC-007', 'Salsa picante de ají cacho de cabra ahumado al estilo mapuche.', NULL, '2025-03-05', '2024-03-05', 3500, 20, 4, 'Sabores del Sur', 2, NULL, true, NOW(), false),
('Caldo Concentrado Maggi Pollo 1kg', 'LOT-COC-008', 'Caldo concentrado en polvo sabor pollo, ideal para sopas y guisos.', NULL, '2025-02-12', '2024-02-12', 7600, 45, 8, 'Nestlé Chile', 2, NULL, true, NOW(), false),
('Curry en Polvo Hindú 250g', 'LOT-COC-009', 'Mezcla de especias aromáticas estilo hindú, ideal para cocina internacional.', NULL, '2025-01-30', '2024-01-30', 4800, 25, 4, 'Especias del Mundo', 2, NULL, true, NOW(), false),
('Orégano Seco Chileno 500g', 'LOT-COC-010', 'Orégano deshidratado de origen nacional, aroma intenso y sabor único.', NULL, '2025-02-22', '2024-02-22', 3800, 35, 6, 'Hierbas del Maule', 2, NULL, true, NOW(), false),
('Pimienta Negra Molida 250g', 'LOT-COC-011', 'Pimienta negra molida de alta calidad, ideal para todo tipo de preparaciones.', NULL, '2025-01-18', '2024-01-18', 4500, 30, 5, 'Especias Premium', 2, NULL, true, NOW(), false),
('Sal de Mar Cahuil 1kg', 'LOT-COC-012', 'Sal de mar artesanal cosechada en Cahuil, Región de O''Higgins.', NULL, '2026-02-01', '2024-02-01', 2200, 100, 20, 'Salinas de Cahuil', 2, NULL, true, NOW(), false);

-- Bebidas y lácteos
INSERT INTO producto (name, batch_code, description, chem_code, exp_date, elab_date, cost, stock, stock_critico, proveedor, categoria_id, image, active_status, creation_date, destacado) VALUES
('Leche Entera Colún 1L', 'LOT-BEB-001', 'Leche entera ultrapasteurizada, fortificada con vitaminas A y D.', NULL, '2024-09-01', '2024-03-01', 1250, 120, 20, 'Colún', 3, NULL, true, NOW(), false),
('Yoghurt Soprole Natural 1kg', 'LOT-BEB-002', 'Yoghurt natural sin azúcar, ideal para preparaciones y consumo directo.', NULL, '2024-06-10', '2024-03-10', 2800, 60, 10, 'Soprole', 3, NULL, true, NOW(), false),
('Queso Gouda Quillayes 500g', 'LOT-BEB-003', 'Queso gouda de maduración media, textura semidura y sabor suave.', NULL, '2024-08-20', '2024-02-20', 4800, 40, 8, 'Quillayes', 3, NULL, true, NOW(), false),
('Crema para Café Loncoleche 200ml', 'LOT-BEB-004', 'Crema láctea líquida, especial para café y repostería.', NULL, '2024-06-12', '2024-03-12', 950, 90, 15, 'Loncoleche', 3, NULL, true, NOW(), false),
('Jugo Watts Naranja 1L', 'LOT-BEB-005', 'Jugo de naranja pasteurizado, sin azúcar añadida.', NULL, '2024-07-05', '2024-03-05', 1800, 100, 18, 'Watts', 3, NULL, true, NOW(), false),
('Agua Mineral Cachantún Sin Gas 1.5L', 'LOT-BEB-006', 'Agua mineral natural, baja en sodio, en envase PET.', NULL, '2025-02-28', '2024-02-28', 850, 200, 30, 'Cachantún', 3, NULL, true, NOW(), false),
('Bebida Coca-Cola 1.5L', 'LOT-BEB-007', 'Bebida gaseosa sabor cola, en formato retornable.', NULL, '2024-09-08', '2024-03-08', 1600, 150, 25, 'Coca-Cola Chile', 3, NULL, true, NOW(), false),
('Bebida Sprite Zero 1.5L', 'LOT-BEB-008', 'Bebida gaseosa sin azúcar, sabor lima-limón.', NULL, '2024-09-09', '2024-03-09', 1550, 140, 25, 'Coca-Cola Chile', 3, NULL, true, NOW(), false),
('Cerveza Cristal 1L', 'LOT-BEB-009', 'Cerveza lager chilena, refrescante y balanceada.', NULL, '2024-08-18', '2024-02-18', 1350, 180, 30, 'CCU', 3, NULL, true, NOW(), false),
('Vino Tinto Reservado Concha y Toro 750ml', 'LOT-BEB-010', 'Vino tinto reserva especial, cepa Cabernet Sauvignon.', NULL, '2030-03-01', '2022-03-01', 4200, 75, 12, 'Concha y Toro', 3, NULL, true, NOW(), false);

--Químicos
INSERT INTO producto (name, batch_code, description, chem_code, exp_date, elab_date, cost, stock, stock_critico, proveedor, categoria_id, image, active_status, creation_date, destacado) VALUES
('Desengrasante Industrial Concentrado 5L', 'LOT-QUI-001', 'Desengrasante alcalino concentrado para limpieza de cocinas industriales. Diluir 1:10.', 'Q-ALC-01', '2024-09-03', '2024-02-15', 18500, 30, 5, 'Químicos Industriales Pro', 4, NULL, true, NOW(), false),
('Sanitizante Alimentario sin Enjuague 1L', 'LOT-QUI-002', 'Sanitizante a base de amonio cuaternario. Apto para contacto indirecto con alimentos.', 'Q-AMON-04', '2024-09-11', '2024-03-01', 6800, 85, 15, 'Higiene Profesional', 4, NULL, true, NOW(), false),
('Detergente Lavavajillas Manual 5L', 'LOT-QUI-003', 'Detergente concentrado para lavado manual de vajilla. pH neutro, amigable con la piel.', 'Q-SURF-07', '2024-08-28', '2024-03-05', 8900, 50, 8, 'Detergentes Eco', 4, NULL, true, NOW(), false),
('Cloro Gel Espeso 2L', 'LOT-QUI-004', 'Hipoclorito de sodio en gel para desinfección de superficies. Mayor adherencia y efectividad.', 'CAS 7681-52-9', '2024-09-06', '2024-03-02', 4200, 70, 12, 'Desinfectantes Plus', 4, NULL, true, NOW(), false),
('Limpiador Multiusos Concentrado 1L', 'LOT-QUI-005', 'Limpiador enzimático multiuso. Biodegradable y seguro para uso alimentario.', 'Q-ENZ-02', '2024-09-02', '2024-02-20', 5500, 95, 18, 'EcoLimp Solutions', 4, NULL, true, NOW(), false),
('Alcohol Etílico 70% Antiséptico 5L', 'LOT-QUI-006', 'Alcohol etílico 70% para desinfección de superficies y equipos. Uso profesional en cocinas.', 'CAS 64-17-5', '2024-09-10', '2024-02-28', 12500, 40, 8, 'Alcoholes Industriales', 4, NULL, true, NOW(), false),
('Desinfectante Cuaternario de Amonio 1L', 'LOT-QUI-007', 'Desinfectante no corrosivo a base de sales cuaternarias. Amplio espectro antimicrobiano.', 'Q-AMON-05', '2024-08-28', '2024-03-03', 7800, 35, 6, 'Desinfectantes Pro', 4, NULL, true, NOW(), false),
('Limpiador de Hornos Profesional 750ml', 'LOT-QUI-008', 'Desengrasante alcalino especial para hornos. Remueve grasa carbonizada sin dañar superficies.', 'Q-ALC-03', '2024-09-02', '2024-03-01', 9200, 25, 4, 'Limpieza Industrial', 4, NULL, true, NOW(), false),
('Jabón Líquido Antibacterial 4L', 'LOT-QUI-009', 'Jabón líquido con agentes antibacteriales para lavado de manos en cocinas comerciales.', 'Q-ANTIB-09', '2024-09-07', '2024-02-22', 11800, 50, 10, 'Higiene Personal Pro', 4, NULL, true, NOW(), false),
('Descalcificador para Equipos 2L', 'LOT-QUI-010', 'Ácido cítrico concentrado para descalcificar máquinas de café, hervidores y equipos de vapor.', 'CAS 77-92-9', '2024-08-19', '2024-03-04', 8500, 30, 5, 'Mantenimiento Equipos', 4, NULL, true, NOW(), false);

--Equipamiento
INSERT INTO producto (name, batch_code, description, chem_code, exp_date, elab_date, cost, stock, stock_critico, proveedor, categoria_id, image, active_status, creation_date, destacado) VALUES
('Molde para Pan de Molde Antiadherente', 'LOT-EQU-001', 'Molde rectangular 30x12x8cm con recubrimiento antiadherente. Acero aluminizado de alta calidad.', NULL, '2030-01-15', '2024-01-15', 14500, 25, 3, 'Utensilios Pro', 5, NULL, true, NOW(), false),
('Batidor Globo Acero Inoxidable 30cm', 'LOT-EQU-002', 'Batidor de varillas profesional. Mango ergonómico y alambre de acero inoxidable 18/10.', NULL, '2034-02-10', '2024-02-10', 8900, 35, 5, 'Herramientas de Cocina', 5, NULL, true, NOW(), false),
('Termómetro Digital para Horno', 'LOT-EQU-003', 'Termómetro digital con sonda. Rango -50°C a +300°C. Pantalla LCD grande y cable de 1 metro.', NULL, '2029-01-20', '2024-01-20', 22500, 15, 2, 'Instrumentos de Medición', 5, NULL, true, NOW(), false),
('Báscula Digital de Precisión 5kg', 'LOT-EQU-004', 'Báscula digital con precisión de 1g. Plataforma de acero inoxidable 21x16cm. Función tara.', NULL, '2029-02-15', '2024-02-15', 45600, 15, 2, 'Balanzas Profesionales', 5, NULL, true, NOW(), false),
('Espátula de Silicona Set 3 Tamaños', 'LOT-EQU-005', 'Set de espátulas de silicona alimentaria resistente hasta 250°C. Mango de madera.', NULL, '2034-02-28', '2024-02-28', 12800, 40, 8, 'Utensilios Silicona', 5, NULL, true, NOW(), false),
('Rallador Microplane Acero Inoxidable', 'LOT-EQU-006', 'Rallador profesional de acero inoxidable. Cuchillas ultra afiladas para cítricos, queso y especias.', NULL, '2034-01-25', '2024-01-25', 18900, 20, 3, 'Herramientas Premium', 5, NULL, true, NOW(), false),
('Mandolina Profesional con Protector', 'LOT-EQU-007', 'Mandolina de acero inoxidable con 5 cuchillas intercambiables. Incluye protector de manos.', NULL, '2034-01-10', '2024-01-10', 35700, 12, 2, 'Cortadores Pro', 5, NULL, true, NOW(), false),
('Rodillo de Amasado Francés 40cm', 'LOT-EQU-008', 'Rodillo de madera de haya sin mangos. Diseño francés tradicional para masas delicadas.', NULL, '2034-02-05', '2024-02-05', 16500, 25, 4, 'Maderas Gastronómicas', 5, NULL, true, NOW(), false),
('Boquillas para Manga Pastelera Set 24', 'LOT-EQU-009', 'Set completo de 24 boquillas de acero inoxidable. Incluye boquillas lisas, rizadas y especiales.', NULL, '2034-02-20', '2024-02-20', 22400, 18, 3, 'Decoración Profesional', 5, NULL, true, NOW(), false);

--Kits
INSERT INTO producto (name, batch_code, description, chem_code, exp_date, elab_date, cost, stock, stock_critico, proveedor, categoria_id, image, active_status, creation_date, destacado) VALUES
('Kit Básico Panadería Casera', 'LOT-ESP-001', 'Kit completo para iniciarse en panadería: harina, levadura, sal, molde y recetario básico.', NULL, '2024-09-01', '2024-03-01', 18900, 20, 3, 'Kits Especializados', 6, NULL, true, NOW(), false);​

--Muestras
INSERT INTO producto (name, batch_code, description, chem_code, exp_date, elab_date, cost, stock, stock_critico, proveedor, categoria_id, image, active_status, creation_date, destacado) VALUES
('Muestra Gratuita - Aditivo Mejorante', 'LOT-ESP-002', 'Muestra gratuita de 100g de aditivo mejorante para pan. Mejora textura, volumen y conservación.', 'E-MALT-01', '2024-09-10', '2024-03-10', 0, 100, 20, 'Aditivos Panificación', 7, NULL, true, NOW(), false);​

--Ingredientes
INSERT INTO producto (name, batch_code, description, chem_code, exp_date, elab_date, cost, stock, stock_critico, proveedor, categoria_id, image, active_status, creation_date, destacado) VALUES
('Lecitina de Soja en Polvo 500g', 'LOT-ING-001', 'Emulsionante natural derivado de la soja. Mejora textura en chocolates, panes y productos horneados.', 'E322', '2025-02-10', '2024-02-10', 8900, 30, 5, 'Aditivos Naturales', 8, NULL, true, NOW(), false),
('Ácido Cítrico Alimentario 1kg', 'LOT-ING-002', 'Ácido cítrico grado alimentario. Conservante natural, regulador de acidez y antioxidante.', 'E330', '2026-03-04', '2024-03-04', 5600, 45, 8, 'Conservantes Naturales', 8, NULL, true, NOW(), false),
('Goma Xantana 250g', 'LOT-ING-003', 'Espesante y estabilizante natural. Ideal para salsas, helados y productos sin gluten.', 'E415', '2026-02-12', '2024-02-12', 15800, 20, 3, 'Hidrocoloides Pro', 8, NULL, true, NOW(), false),
('Maltodextrina 1kg', 'LOT-ING-004', 'Carbohidrato complejo de rápida absorción. Para encapsular aceites y crear polvos aromáticos.', 'MALT-DEX', '2026-02-26', '2024-02-26', 6800, 35, 6, 'Carbohidratos Funcionales', 8, NULL, true, NOW(), false),
('Proteína de Suero Concentrada 1kg', 'LOT-ING-005', 'Proteína whey concentrada 80%. Para enriquecer productos horneados y batidos nutritivos.', NULL, '2025-03-13', '2024-03-13', 24500, 25, 4, 'Proteínas Deportivas', 8, NULL, true, NOW(), false);​

--Envases
INSERT INTO producto (name, batch_code, description, chem_code, exp_date, elab_date, cost, stock, stock_critico, proveedor, categoria_id, image, active_status, creation_date, destacado) VALUES
('Cajas para Torta Blancas 30x30x15cm', 'LOT-ENV-001', 'Cajas de cartón alimentario blanco para tortas. Base reforzada y ventana transparente. Pack x 50 unidades.', NULL, '2027-03-08', '2024-03-08', 18500, 40, 8, 'Embalajes Dulces', 9, NULL, true, NOW(), false),
('Bolsas Kraft con Ventana 500g', 'LOT-ENV-002', 'Bolsas de papel kraft con ventana transparente. Ideales para productos de panadería. Pack x 100 unidades.', NULL, '2027-02-28', '2024-02-28', 12400, 60, 12, 'Papeles Ecológicos', 9, NULL, true, NOW(), false),
('Recipientes Plásticos con Tapa 1L', 'LOT-ENV-003', 'Contenedores de polipropileno con tapa hermética. Aptos para microondas y lavavajillas. Pack x 25.', 'PP-FOOD', '2029-03-06', '2024-03-06', 22800, 30, 5, 'Plásticos Alimentarios', 9, NULL, true, NOW(), false);

--Temporada
INSERT INTO producto (name, batch_code, description, chem_code, exp_date, elab_date, cost, stock, stock_critico, proveedor, categoria_id, image, active_status, creation_date, destacado) VALUES
('Castañas Confitadas en Almíbar 2kg', 'LOT-TMP-001', 'Castañas europeas confitadas en almíbar. Producto de temporada otoño-invierno para repostería fina.', NULL, '2025-02-10', '2024-02-10', 34500, 15, 2, 'Conservas Estacionales', 10, NULL, true, NOW(), false),
('Puré de Calabaza Natural 1kg', 'LOT-TMP-002', 'Puré de calabaza butternut natural sin aditivos. Ideal para tartas, panes y postres otoñales.', NULL, '2024-09-15', '2024-03-15', 7800, 25, 4, 'Purés Naturales', 10, NULL, true, NOW(), false);
