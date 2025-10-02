import React, { useEffect, useMemo } from 'react';
import Svg, { Defs, RadialGradient, Stop, Path, Circle } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing } from 'react-native-reanimated';

type Props = {
  size?: number;
  /** 0..1 */
  progress: number;
  /** Couleur du contour */
  color?: string;
  /** Couleur “matière” (eau) */
  fill?: string;
  /** Couleur du fond */
  bg?: string;
  /** Épaisseur du contour */
  strokeWidth?: number;
};

const AnimatedPath = Animated.createAnimatedComponent(Path);

// util bornée (évite NaN / <0 / >1)
const clamp01 = (x: number) => Math.max(0, Math.min(1, Number.isFinite(x) ? x : 0));

export default function ProgressFillCircle({
  size = 240,
  progress,
  color = '#1EA7FD',
  fill = '#1EA7FD',
  bg = '#F3F4F6',
  strokeWidth = 8,
}: Props) {
  // tailles sûres
  const S = Math.max(1, size);
  const cx = S / 2;
  const cy = S / 2;
  const r  = Math.max(0.0001, (S - strokeWidth) / 2);

  // id de gradient unique par instance (évite collisions)
  const gradId = useMemo(() => `waterGrad-${Math.random().toString(36).slice(2, 9)}`, []);

  // angle animé en degrés
  const angle = useSharedValue(0);

  useEffect(() => {
    const clamped = clamp01(progress);
    // éviter 360° exact (certains moteurs SVG n’aiment pas l’arc complet)
    const targetDeg = clamped * 359.999;
    angle.value = withTiming(targetDeg, { duration: 600, easing: Easing.out(Easing.cubic) });
  }, [progress]);

  // IMPORTANT : tout le calcul se fait inline (pas d'appel à une fonction JS externe)
  const animatedProps = useAnimatedProps(() => {
    let a = angle.value;

    // cas 0% → path minuscule (évite path vide)
    if (a <= 0.0001) {
      const tiny = 0.0001;
      const startX = cx + r * Math.cos(-Math.PI / 2);                 // angle 0° (au “nord”)
      const startY = cy + r * Math.sin(-Math.PI / 2);
      const endX   = cx + r * Math.cos((tiny - 90) * Math.PI / 180);  // 0.0001°
      const endY   = cy + r * Math.sin((tiny - 90) * Math.PI / 180);
      const dTiny  = `M ${cx} ${cy} L ${startX} ${startY} L ${endX} ${endY} Z`;
      return { d: dTiny } as any;
    }

    if (a >= 360) a = 359.999;
    const largeArc = a > 180 ? 1 : 0;

    // start = angle 0° (= -90 en repère SVG)
    const startX = cx + r * Math.cos(-Math.PI / 2);
    const startY = cy + r * Math.sin(-Math.PI / 2);
    // end = angle a
    const endX   = cx + r * Math.cos((a - 90) * Math.PI / 180);
    const endY   = cy + r * Math.sin((a - 90) * Math.PI / 180);

    const d = `M ${cx} ${cy} L ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY} Z`;
    return { d } as any;
  });

  return (
    <Svg width={S} height={S}>
      {/* fond */}
      <Circle cx={cx} cy={cy} r={r} fill={bg} />

      {/* dégradé radial (id unique) */}
      <Defs>
        <RadialGradient id={gradId} cx="50%" cy="40%" r="70%">
          <Stop offset="0%" stopColor={fill} stopOpacity="0.95" />
          <Stop offset="100%" stopColor={fill} stopOpacity="0.75" />
        </RadialGradient>
      </Defs>

      {/* remplissage animé */}
      <AnimatedPath animatedProps={animatedProps} fill={`url(#${gradId})`} />

      {/* contour */}
      <Circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}
