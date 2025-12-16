import DashboardContainer from "@/components/shared/old-dashboard/DashboardContainer";
import ImageLibrary from "../image-library/ImageLibrary";
import PageTitle from "@/components/shared/PageTitle/PageTitle";

export default function Midia() {
    return (
        <DashboardContainer>
            <div className="flex flex-col w-full h-[84.5vh]">
                <PageTitle title="Biblioteca de mídia" desc="Lorem ipsum dolumn." />
                <ImageLibrary />
            </div>
        </DashboardContainer>
    )
}