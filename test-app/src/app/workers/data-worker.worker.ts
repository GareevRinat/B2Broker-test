let intervalId: NodeJS.Timeout | null = null;

addEventListener('message', ({ data }) => {
  const { interval, arraySize } = data;

  if(intervalId) {
    clearInterval(intervalId)
  }

  console.log('Web worker started with interval:', interval, 'and array size:', arraySize);

  const generateRandomData = (): any => {
    return {
      id: (Math.floor(Math.random() * 900) + 100).toString(),
      int: Math.floor(Math.random() * 100),
      float: parseFloat((Math.random() * 100).toFixed(18)),
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      child: {
        id: (Math.floor(Math.random() * 900) + 100).toString(),
        color: '#' + Math.floor(Math.random() * 16777215).toString(16)
      }
    };
  };

  intervalId = setInterval(() => {
    const dataArray = Array.from({ length: arraySize }, generateRandomData);

    postMessage(dataArray);
  }, interval);
});
