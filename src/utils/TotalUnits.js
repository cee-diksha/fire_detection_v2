export const totalUnits = (allDevices, unit) => {
        
        const result = allDevices.filter(item => item?.nodeType?.toLowerCase() === unit && item?.statusCode === 1)
        return result.length   
}