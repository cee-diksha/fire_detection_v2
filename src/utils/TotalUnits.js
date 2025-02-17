export const totalUnits = (allDevices, unit) => {
    console.log(allDevices, "devices")
    const result = allDevices.filter(item => item.nodeType.toLowerCase() === unit && item.statusCode === 1)
    return result.length
}