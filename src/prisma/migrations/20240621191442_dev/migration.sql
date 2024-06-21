-- CreateTable
CREATE TABLE "Usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "rolId" INTEGER NOT NULL,
    CONSTRAINT "Usuarios_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Roles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Roles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Ofertas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "monto" INTEGER NOT NULL,
    "plazo" TEXT NOT NULL,
    "quotas" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Ofertas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Prestamos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha_aceptacion" DATETIME NOT NULL,
    "aprobado" BOOLEAN NOT NULL,
    "fecha_aprobacion" DATETIME NOT NULL,
    "entregado" BOOLEAN NOT NULL,
    "fecha_desembolso" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    "ofertaId" INTEGER NOT NULL,
    CONSTRAINT "Prestamos_ofertaId_fkey" FOREIGN KEY ("ofertaId") REFERENCES "Ofertas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Prestamos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cuotas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descripcion" TEXT NOT NULL,
    "fecha_pago" DATETIME NOT NULL,
    "monto_inicial" REAL NOT NULL,
    "monto_pagado" REAL NOT NULL,
    "pendiente" BOOLEAN NOT NULL,
    "prestamoId" INTEGER NOT NULL,
    CONSTRAINT "Cuotas_prestamoId_fkey" FOREIGN KEY ("prestamoId") REFERENCES "Prestamos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transacciones" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "billingReceipt" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL,
    "monto" REAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "cuotaId" INTEGER NOT NULL,
    "reverted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Transacciones_cuotaId_fkey" FOREIGN KEY ("cuotaId") REFERENCES "Cuotas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
