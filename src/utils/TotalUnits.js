export const totalUnits = (allDevices, unit, isSettings) => {
        
        const result = allDevices.filter(item => item?.nodeType?.toLowerCase() === unit && (item?.statusCode === 1 || isSettings))
        return result.length   
}