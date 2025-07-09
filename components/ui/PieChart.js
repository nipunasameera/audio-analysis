// components/PieChart.js

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useUploadStore } from '@/hooks/useUpload';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
    const { sentiment } = useUploadStore();
  const data = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        label: 'Sentiment Analysis',
        data: [(sentiment.overall.positiveConfidence).toFixed(2), (sentiment.overall.neutralConfidence).toFixed(2), (sentiment.overall.negativeConfidence).toFixed(2)],
        backgroundColor: ['#00FF00', '#FFFF00', '#FF0000'],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={data} />;
};

export default PieChart;
