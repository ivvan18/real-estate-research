export function normalize(list) {
  const minMax = list.reduce((acc, value) => {
    if (value < acc.min) {
      acc.min = value;
    }

    if (value > acc.max) {
      acc.max = value;
    }

    return acc;
  }, {min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY});

  return list.map(value => {

    if (minMax.max === minMax.min) {
      return 1 / list.length;
    }

    const diff = minMax.max - minMax.min;
    return (value - minMax.min) / diff;
  });
}

function standardDeviation(values: any[]) {
  const avg = average(values);

  const squareDiffs = values.map(value => (value - avg) * (value - avg));

  const avgSquareDiff = average(squareDiffs);

  return Math.sqrt(avgSquareDiff);
}

function average(data: any[]) {
  const sum = data.reduce((currentSum, value) => {
    return currentSum + value;
  }, 0);

  return sum / data.length;
}


export function getKDEIntervals(values: any[], nn: number, nb: number, bh: number) {
  const bins = new Array(nb).fill(0);
  const N = values.length;

  const h = standardDeviation(values) * Math.pow((4 / (3 * N)), 1 / 5);

  for (let i = 0; i < N; i++) {
    const value = values[i];

    const bin = Math.ceil(value / bh);
    let sum = 0;
    for (let j = Math.max(1, i - nn); j < Math.min(N, i + nn); j++) {
      const v = (value - values[j]) / h;
      sum += Math.exp(-0.5 * v * v) / Math.sqrt(2 * Math.PI);
    }

    const density = sum / (2 * nn * h);
    bins[bin] += density;
  }

  for (let i = 2; i < nb - 1; i++) {
    bins[i] = (bins[i - 1] + bins[i] + bins[i + 1]) / 3;
  }

  const linespace = linspace(0, 1, nb);
  const minimumsIndexes = findLocalMinimumsIndexes(bins);

  const result = [];

  minimumsIndexes.forEach(idx => {
    result.push(linespace[idx]);
  });

  return result;
}

function linspace(startValue: number, stopValue: number, cardinality: number) {
  const arr = [];

  const step = (stopValue - startValue) / (cardinality - 1);
  for (let i = 0; i < cardinality; i++) {
    arr.push(startValue + (step * i));
  }

  return arr;
}

function findLocalMinimumsIndexes(arr: any[]) {
  let peak;
  let peakIndex;

  return arr.reduce((peaks, val, i) => {
    if (arr[i + 1] < arr[i]) {
      peak = arr[i + 1];
      peakIndex = i + 1;
    } else if ((arr[i + 1] > arr[i]) && (typeof peak === 'number')) {
      peaks.push(peakIndex);
      peak = undefined;
    }
    return peaks;
  }, []);
}

export function getIntervalIndex(value, intervals) {
  const leftBorder = intervals[0];
  const rightBorder = intervals[intervals.length - 1];

  if (value <= leftBorder) {
    return 0;
  }

  if (value >= rightBorder) {
    return intervals.length;
  }

  for (let i = 1; i < intervals.length; i++) {
    if (value <= intervals[i] && value >= intervals[i - 1]) {
      return i;
    }
  }
}
