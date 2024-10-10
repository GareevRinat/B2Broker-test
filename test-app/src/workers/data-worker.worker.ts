addEventListener('message', ({ data }) => {
  const { interval, arraySize } = data;

  console.log('Web worker started with interval:', interval, 'and array size:', arraySize);

  const generateRandomData = (): any => {
    return {
      id: (Math.random() * 1000).toString(),
      int: Math.floor(Math.random() * 100),
      float: parseFloat((Math.random() * 100).toFixed(18)),
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      child: {
        id: (Math.random() * 1000).toString(),
        color: '#' + Math.floor(Math.random() * 16777215).toString(16)
      }
    };
  };

  setInterval(() => {
    const dataArray = Array.from({ length: arraySize }, generateRandomData);

    postMessage(dataArray);
  }, interval);
});
