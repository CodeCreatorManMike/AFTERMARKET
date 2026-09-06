import React from 'react';
import Svg, { Path, Circle, Line } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const base = (size = 24) => ({ width: size, height: size, viewBox: '0 0 24 24' });

export function HomeIcon({ size = 24, color = '#14102B', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M3 11.5L12 4l9 7.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M5.5 10v9a1 1 0 001 1H9a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2.5a1 1 0 001-1v-9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function SearchIcon({ size = 24, color = '#14102B', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Circle cx={11} cy={11} r={6.5} stroke={color} strokeWidth={strokeWidth} />
      <Line x1={20} y1={20} x2={15.7} y2={15.7} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function TicketIcon({ size = 24, color = '#14102B', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path
        d="M3 9a2 2 0 002 2 2 2 0 010 4 2 2 0 00-2 2v1a1 1 0 001 1h16a1 1 0 001-1v-1a2 2 0 00-2-2 2 2 0 010-4 2 2 0 002-2V8a1 1 0 00-1-1H4a1 1 0 00-1 1v1z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Line x1={12} y1={7.5} x2={12} y2={16.5} stroke={color} strokeWidth={strokeWidth} strokeDasharray="2,2.4" strokeLinecap="round" />
    </Svg>
  );
}

export function ProfileIcon({ size = 24, color = '#14102B', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Circle cx={12} cy={8.2} r={3.7} stroke={color} strokeWidth={strokeWidth} />
      <Path d="M4.5 20c1.2-4 4-6 7.5-6s6.3 2 7.5 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function MapPinIcon({ size = 18, color = '#14102B', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M12 21s7-6.4 7-11.6A7 7 0 105 9.4C5 14.6 12 21 12 21z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <Circle cx={12} cy={9.4} r={2.4} stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}

export function CalendarIcon({ size = 18, color = '#14102B', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M4.5 5.5h15a1 1 0 011 1V19a1 1 0 01-1 1h-15a1 1 0 01-1-1V6.5a1 1 0 011-1z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <Line x1={3.5} y1={9.5} x2={20.5} y2={9.5} stroke={color} strokeWidth={strokeWidth} />
      <Line x1={8} y1={3.5} x2={8} y2={7} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1={16} y1={3.5} x2={16} y2={7} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function SlidersIcon({ size = 18, color = '#14102B', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Line x1={5} y1={6} x2={19} y2={6} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1={5} y1={12} x2={19} y2={12} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1={5} y1={18} x2={19} y2={18} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Circle cx={9} cy={6} r={1.8} fill={color} />
      <Circle cx={15} cy={12} r={1.8} fill={color} />
      <Circle cx={11} cy={18} r={1.8} fill={color} />
    </Svg>
  );
}

export function HeartIcon({ size = 20, color = '#14102B', strokeWidth = 2, filled = false }: IconProps & { filled?: boolean }) {
  return (
    <Svg {...base(size)} fill={filled ? color : 'none'}>
      <Path
        d="M12 20s-7.5-4.6-9.7-9.3C.7 7.1 2.4 4 5.7 4c1.9 0 3.4 1 4.3 2.4C11 4.9 12.5 4 14.4 4c3.3 0 5 3.1 3.4 6.7C19.5 15.4 12 20 12 20z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ClockIcon({ size = 18, color = '#14102B', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Circle cx={12} cy={12} r={8.5} stroke={color} strokeWidth={strokeWidth} />
      <Path d="M12 7.5V12l3.2 1.9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function XIcon({ size = 16, color = '#14102B', strokeWidth = 2.2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Line x1={5} y1={5} x2={19} y2={19} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1={19} y1={5} x2={5} y2={19} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function ChevronDownIcon({ size = 14, color = '#14102B', strokeWidth = 2.2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M5 8.5l7 7 7-7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function SunIcon({ size = 20, color = '#14102B', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Circle cx={12} cy={12} r={4.4} stroke={color} strokeWidth={strokeWidth} />
      <Line x1={12} y1={2.5} x2={12} y2={5} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1={12} y1={19} x2={12} y2={21.5} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1={2.5} y1={12} x2={5} y2={12} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1={19} y1={12} x2={21.5} y2={12} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1={5.1} y1={5.1} x2={6.8} y2={6.8} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1={17.2} y1={17.2} x2={18.9} y2={18.9} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1={5.1} y1={18.9} x2={6.8} y2={17.2} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1={17.2} y1={6.8} x2={18.9} y2={5.1} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function MoonIcon({ size = 20, color = '#14102B', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path
        d="M20 13.5A8.5 8.5 0 1110.5 4a6.8 6.8 0 009.5 9.5z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        fill={color}
        fillOpacity={0.06}
      />
    </Svg>
  );
}

export function BackArrowIcon({ size = 20, color = '#14102B', strokeWidth = 2.2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M19 12H5M5 12l6-6M5 12l6 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function PencilIcon({ size = 18, color = '#14102B', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path
        d="M4 20l.9-3.6L16.2 5.1a1.5 1.5 0 012.1 0l1.6 1.6a1.5 1.5 0 010 2.1L8.6 20 4 20z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Line x1={14.5} y1={6.8} x2={18.2} y2={10.5} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function LinkIcon({ size = 18, color = '#14102B', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path
        d="M10 14a4 4 0 005.7.2l2.3-2.3a4 4 0 00-5.7-5.7l-1.3 1.3"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 10a4 4 0 00-5.7-.2L6 12.1a4 4 0 005.7 5.7l1.3-1.3"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function AddFriendIcon({ size = 20, color = '#14102B', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Circle cx={9.5} cy={8.2} r={3.4} stroke={color} strokeWidth={strokeWidth} />
      <Path d="M3 20c1.1-3.6 3.6-5.4 6.5-5.4S14.9 16.4 16 20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1={18.5} y1={5.5} x2={18.5} y2={11.5} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1={15.5} y1={8.5} x2={21.5} y2={8.5} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function PlaneIcon({ size = 24, color = '#14102B', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path
        d="M21 12l-7-2.2V4.8a1.6 1.6 0 00-3.2 0v5L3 12v2l7.8-1.9v4.4L8.5 18v1.6l3.5-1 3.5 1V18l-2.3-1.5v-4.4L21 14z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function BoltIcon({ size = 24, color = '#14102B', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M13 3L4.5 14h5.5l-1 7L19 10h-5.5l-0.5-7z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </Svg>
  );
}

export function DiagonalArrowIcon({ size = 24, color = '#14102B', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M7 17L17 7M9 7h8v8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function QRIcon({ size = 24, color = '#14102B' }: IconProps) {
  const Block = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
    <Path d={`M${x} ${y}h${w}v${h}h${-w}z`} fill={color} />
  );
  return (
    <Svg {...base(size)} fill="none">
      {/* top-left finder */}
      <Path d="M2 2h7v7H2z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <Block x={4.2} y={4.2} w={2.6} h={2.6} />
      {/* top-right finder */}
      <Path d="M15 2h7v7h-7z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <Block x={17.2} y={4.2} w={2.6} h={2.6} />
      {/* bottom-left finder */}
      <Path d="M2 15h7v7H2z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <Block x={4.2} y={17.2} w={2.6} h={2.6} />
      {/* scattered data modules */}
      <Block x={11} y={2} w={2} h={2} />
      <Block x={11} y={5.5} w={2} h={2} />
      <Block x={11} y={11} w={2} h={2} />
      <Block x={15} y={11} w={2} h={2} />
      <Block x={19} y={11} w={2} h={2} />
      <Block x={15} y={15} w={2} h={2} />
      <Block x={11} y={15} w={2} h={2} />
      <Block x={11} y={19} w={2} h={2} />
      <Block x={15} y={19} w={2} h={2} />
      <Block x={19} y={19} w={2} h={2} />
      <Block x={19} y={15} w={2} h={2} />
    </Svg>
  );
}

export function GearIcon({ size = 20, color = '#14102B', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={strokeWidth} />
      <Path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
