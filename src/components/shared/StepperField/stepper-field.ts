type activeParams = {
    colorActive: string;
    colorInactive: string;
}
const stepperStyle = {
    number: (active: boolean, { colorActive, colorInactive }: activeParams) => `
    flex items-center justify-center
    rounded-full w-[30px] h-[30px]
    inline transition-all ease-linear
    ${active ? `${colorActive} text-white` : `${colorInactive} text-gray-800`}
    `,
    label: (active: boolean) => `
    grow inline 
    text-[9.5px] sm:text-sm
    font-bold
    ${active ? 'text-emerald-800' : 'text-gray-300'}
    `
};

export default stepperStyle;