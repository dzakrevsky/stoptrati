import {
  ShoppingBasket,
  Bus,
  Gamepad2,
  HeartPulse,
  Home,
  Shirt,
  MoreHorizontal,
  Coffee,
  Plane,
  Smartphone,
  Gift,
  BookOpen,
  Music,
  Film,
  Car,
  Utensils,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  ShoppingBasket,
  Bus,
  Gamepad2,
  HeartPulse,
  Home,
  Shirt,
  MoreHorizontal,
  Coffee,
  Plane,
  Smartphone,
  Gift,
  BookOpen,
  Music,
  Film,
  Car,
  Utensils,
};

interface CategoryIconProps {
  icon: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export default function CategoryIcon({ icon, color, size = 'md' }: CategoryIconProps) {
  const IconComponent = iconMap[icon] || MoreHorizontal;

  return (
    <div
      className={`${sizeClasses[size]} rounded-xl flex items-center justify-center`}
      style={{ backgroundColor: `${color}20` }}
    >
      <IconComponent className={iconSizes[size]} style={{ color }} />
    </div>
  );
}

export const availableIcons = Object.keys(iconMap);
