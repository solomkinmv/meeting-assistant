const colors = [
    // custom
    "#1e90ff",
    "#ff9747",
    "#f05797",
    "#2a9010",
    // https://jsfiddle.net/k8NC2/1/
    "#803E75",
    "#FF6800",
    "#A6BDD7",
    "#C10020",
    "#CEA262",
    "#817066",
    "#007D34",
    "#F6768E",
    "#00538A",
    "#FF7A5C",
    "#53377A",
    "#FF8E00",
    "#B32851",
    "#F4C800",
    "#7F180D",
    "#93AA00",
    "#593315",
    "#F13A13",
    "#FFB300",
    "#232C16",
];

export const getColor = (index: number) => {
    return colors[index % colors.length]
}
