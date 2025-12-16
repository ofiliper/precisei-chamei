export default function formatDecimal(value: string): string {

    const numericValue = value.replace(/\D/g, '');

    if (numericValue.length === 4) {
        return `${numericValue.substring(0, 2)}.${numericValue.substring(2)}`;
    } else if (numericValue.length === 5) {
        return `${numericValue.substring(0, 3)}.${numericValue.substring(3)}`;
    } else if (numericValue.length === 6) {
        return `${numericValue.substring(0, 3)}.${numericValue.substring(3)}`;
    }

    return value;
};