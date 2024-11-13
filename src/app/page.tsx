
const Item = ({ label }) => {
  return (
    <li className="text-gray-300 border-gray-300 py-4 pl-4 hover:bg-dark-black-500 cursor-pointer">
      {label}
    </li>
  );
};

export default function Home() {
  const items = [
    {
      label: 'Layout'
    },
    {
      label: 'Ratio'
    },
    {
      label: 'Border'
    },
    {
      label: 'Background'
    }
  ];


  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full min-h-screen flex gap-2">
        <div className="w-[25%] bg-dark-black-600 border-2 border-r border-dark-black-100 flex flex-col justify-center">

          <ul className="flex flex-col gap-2 px-4">
            {items.map((item, index) => (
              <Item key={index} label={item.label} />
            ))}
          </ul>

        </div>
        <div className="w-[60%] flex items-center justify-center">

          <div className="aspect-video bg-dark-black-100">
            <img src="https://placehold.co/400x600" alt="" />
          </div>

        </div>
      </div>
    </main>
  );
}
