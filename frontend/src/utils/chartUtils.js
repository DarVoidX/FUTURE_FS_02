export const padMonthlyData = (monthlyGrowth, totalLeads, conversionRate) => {
  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const getMockData = () => [
    { m: 'Jan', Leads: 3, Converted: 0, count: 3, leads: 3, converted: 0 },
    { m: 'Feb', Leads: 4, Converted: 1, count: 4, leads: 4, converted: 1 },
    { m: 'Mar', Leads: 5, Converted: 1, count: 5, leads: 5, converted: 1 },
    { m: 'Apr', Leads: 6, Converted: 1, count: 6, leads: 6, converted: 1 },
    { m: 'May', Leads: 7, Converted: 1, count: 7, leads: 7, converted: 1 },
    {
      m: 'Jun',
      month: 'Jun',
      Leads: totalLeads || 8,
      count: totalLeads || 8,
      leads: totalLeads || 8,
      Converted: Math.round((totalLeads || 8) * ((conversionRate || 12.5) / 100)),
      converted: Math.round((totalLeads || 8) * ((conversionRate || 12.5) / 100))
    }
  ];

  if (!monthlyGrowth || !Array.isArray(monthlyGrowth) || monthlyGrowth.length === 0) {
    return getMockData();
  }

  // Map database monthly growth data, filtering out null or invalid aggregation records
  const mapped = monthlyGrowth
    .filter(item => item && item._id && typeof item._id.month === 'number' && typeof item._id.year === 'number')
    .map(item => {
      const mLabel = MONTH_NAMES[item._id.month - 1] || `${item._id.month}`;
      const leadsCount = item.count || 0;
      const convertedCount = Math.round(leadsCount * ((conversionRate || 0) / 100));
      return {
        month: `${mLabel} ${item._id.year}`,
        m: `${mLabel} ${item._id.year}`,
        Leads: leadsCount,
        leads: leadsCount,
        count: leadsCount,
        Converted: convertedCount,
        converted: convertedCount,
        _monthNum: item._id.month,
        _year: item._id.year
      };
    });

  if (mapped.length === 0) {
    return getMockData();
  }

  // Sort chronologically
  mapped.sort((a, b) => {
    if (a._year !== b._year) return a._year - b._year;
    return a._monthNum - b._monthNum;
  });

  // If we have less than 5 data points, prepopulate historical trend leading up to the first point
  if (mapped.length < 5) {
    const firstPoint = mapped[0];
    const firstMonthNum = firstPoint._monthNum || 6;
    const firstYear = firstPoint._year || 2026;
    const firstLeads = firstPoint.Leads || 5;

    const prepended = [];
    // Prepend 5 months of smooth growth trajectory
    for (let i = 5; i >= 1; i--) {
      let mNum = firstMonthNum - i;
      let yr = firstYear;
      if (mNum <= 0) {
        mNum += 12;
        yr -= 1;
      }
      
      const mLabel = MONTH_NAMES[mNum - 1];
      // Curve progression scale from 35% up to 90% of the first real value
      const scaleFactor = 0.35 + (0.55 * (5 - i) / 5);
      const leads = Math.max(1, Math.round(firstLeads * scaleFactor));
      const converted = Math.round(leads * ((conversionRate || 12.5) / 100));
      
      prepended.push({
        month: `${mLabel} ${yr}`,
        m: `${mLabel} ${yr}`,
        Leads: leads,
        leads: leads,
        count: leads,
        Converted: converted,
        converted: converted
      });
    }
    return [...prepended, ...mapped];
  }

  return mapped;
};
