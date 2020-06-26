export default {
    optimizeData: function (oldData, width) {
        let data = []

        const cnt = Math.ceil(oldData.length / width);

        if (cnt > 1) {
            let iterations = Math.floor((oldData.length + cnt - 1) / cnt);

            let prevMaxValue = 0.0;

            for (let i = 0; i < iterations; i++) {
                let maxValue = Number.MIN_SAFE_INTEGER;
                let minValue = Number.MAX_SAFE_INTEGER;
                for (let j = i * cnt; j < (i + 1) * cnt; j++) {
                    if (j >= oldData.length) break;

                    maxValue = Math.max(maxValue, oldData[j]);
                    minValue = Math.min(minValue, oldData[j]);
                }

                if (i !== 0 && Math.abs(prevMaxValue - maxValue) < Math.abs(prevMaxValue - minValue)) {
                    let t = maxValue;
                    maxValue = minValue;
                    minValue = t;
                }

                prevMaxValue = maxValue;

                data.push(minValue);
                data.push(maxValue);
            }
        } else {
            data = oldData;
        }
        return data;
    }
}