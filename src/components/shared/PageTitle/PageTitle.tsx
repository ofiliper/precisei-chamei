export default function PageTitle({ title, desc }: { title: string, desc?: string }) {
    return (
        <div className="flex flex-col py-4 px-7 border-b border-stone-200">
            <h3 className="text-xl font-medium">{title}</h3>
            {
                desc && (
                    <p className="text-sm">
                        {desc}
                    </p>
                )
            }
        </div>
    )
}