'use client';

import { useState, useEffect, useRef } from "react";
import DashboardContainer from "@/components/shared/Dashboard/Dashboard";
import { UploadCloud, Trash2, X, AlertTriangle, Loader2, Image as ImageIcon, Calendar, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useImages from "@/hooks/useImages";
import { imageLibraryStore } from "@/store/image-library/image-library-store"; // Importe direto da store criada
import ImageGallery from "@/components/shared/ImageGallery";
import Servicos from "@/components/layout/servicos/Servicos";
import useServices from "@/hooks/useServices";

// IMPORTANTE: Ajuste aqui a URL base se necessário
const BASE_IMAGE_URL = "";

// Interface compatível com o retorno da sua API
interface ImageItem {
  id: string;
  id_workspace?: string;
  name: string | null;
  path: string;
  createdAt: string;
  updatedAt: string;
}

export default function GalleryLayout() {
  return (
    <DashboardContainer>
      <Servicos />
    </DashboardContainer>
  );
}