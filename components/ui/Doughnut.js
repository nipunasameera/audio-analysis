// components/PieChart.js

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useUploadStore } from '@/hooks/useUpload';
import { generateRandomColors } from '@/lib/utils';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
    const { topics_summary } = useUploadStore();
  const data = {
    labels: topics_summary.map((topic) => topic.topic),
    datasets: [
      {
        label: 'Topics Summary',
        data: topics_summary.map((topic) => topic.relevance * 100),
        backgroundColor: generateRandomColors(topics_summary.length),
        borderWidth: 1,
      },
    ],
  };

  return <Doughnut data={data} />;
};

export default DoughnutChart;
