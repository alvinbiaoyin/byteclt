"use client";

export default function Map({ data }: any) {
  return (
    <div style={{ padding: 20 }}>
      <h2>Map (data check)</h2>

      {data.map((d: any, i: number) => (
        <div key={i}>
          {d.hospital} ({d.lat}, {d.lng})
        </div>
      ))}
    </div>
  );
}