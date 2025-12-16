'use client'

import { imageLibraryStore } from "@/store/image-library/image-library-store";
import { BiCheck, BiPlus, BiTrash } from "react-icons/bi"
import { useStore } from "zustand"
import "./image-library-style.css"

export default function ImageLibrary() {

    const imagesLibrary = useStore(imageLibraryStore);
    const { images, imageSelectedIndex } = imagesLibrary.data;

    const selectImage = (index: number) => {
        const newData = { ...imagesLibrary.data };
        if (index === newData.imageSelectedIndex) {
            imagesLibrary.fnOnChange('imageSelectedIndex', -1);
            return
        }
        newData.imageSelectedIndex = index;
        imagesLibrary.fnOnChange('imageSelectedIndex', newData.imageSelectedIndex);
    }

    return (
        <div className={`grid h-full w-full ${imageSelectedIndex != -1 && ('grid-cols-[10fr_2fr]')}`}>
            <div className="overflow-y-scroll h-full container-scroll">
                <div className={`grid grid-cols-[repeat(5,1fr)] justify-start gap-2 p-2  ${imageSelectedIndex != -1 && ('!grid-cols-[repeat(4,1fr)]')}`}>

                    <div
                        className={`transition-all linear-ease flex items-center justify-center rounded-md text-2xl text-white border border-stone-300 bg-stone-50 bg-steal-400 w-full h-full`}>
                        <div className="w-7 h-7 bg-stone-400 flex items-center justify-center rounded-full">
                            <BiPlus />
                        </div>
                    </div>

                    {
                        imagesLibrary.data.images &&
                        imagesLibrary.data.images.map((item: any, index: number) => {
                            return (
                                <div
                                    key={index}
                                    onClick={() => { selectImage(index); }}
                                    className="cursor-pointer rounded-sm h-40 hover:opacity-70 flex justify-center items-center group"
                                    style={{
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundImage: `url(${item.path})`
                                    }}
                                >
                                    <button
                                        className={`transition-all linear-ease opacity-0 invisible group-hover:opacity-100 group-hover:visible h-10 w-10 bg-green-600 flex items-center justify-center rounded-full text-2xl group-hover:text-4xl text-white ${imageSelectedIndex === index && ('!visible !opacity-100')}`}>
                                        <BiCheck />
                                    </button>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            {
                imageSelectedIndex != -1 && (
                    <div className="w-full h-full flex flex-col gap-3 py-3 px-5 bg-white">
                        <div>
                            <h4 className="text-xs mb-1">Nome da imagem:</h4>
                            <input type="text"
                                value={images && imageSelectedIndex != -1 ? images[imageSelectedIndex]?.title : ''}
                                className="text-sm border border-stone-200 focus:outline-none py-1 px-2" />
                        </div>
                        <div>
                            <h4 className="text-xs mb-1">Descrição da imagem:</h4>
                            <input type="text"
                                value={images && imageSelectedIndex != -1 ? images[imageSelectedIndex]?.description : ''}
                                className="text-sm border border-stone-200 focus:outline-none py-1 px-2" />
                        </div>
                        <div>
                            <h4 className="text-xs mb-1">Link da imagem:</h4>
                            <input type="text" readOnly
                                value={images && imageSelectedIndex != -1 ? images[imageSelectedIndex]?.path : ''}
                                className="text-sm border border-stone-200 focus:outline-none py-1 px-2 bg-stone-50" />
                        </div>
                        {
                            images && imageSelectedIndex != -1 && (
                                <div className="mt-auto">
                                    <button className="bg-rose-600 px-3 py-2 flex items-center gap-1 text-white text-sm rounded-md">
                                        <span><BiTrash /></span>
                                        <span>Excluir</span>
                                    </button>
                                </div>
                            )

                        }
                    </div>
                )
            }
        </div>
    )
}