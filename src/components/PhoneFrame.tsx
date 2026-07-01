interface PhoneFrameProps {
  children: React.ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="phone-frame">
      <div className="phone-frame__notch" aria-hidden="true" />
      <div className="phone-frame__screen">{children}</div>
    </div>
  );
}
