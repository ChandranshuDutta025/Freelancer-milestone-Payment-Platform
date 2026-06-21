"use client"

import { motion, type HTMLMotionProps } from "framer-motion"
import {
  fadeUp,
  fadeUpSm,
  fadeIn,
  fadeLeft,
  fadeRight,
  scaleIn,
  staggerContainer,
  staggerSlow,
  staggerFast,
  pageTransition,
  scaleHover,
  scaleTap,
  cardHoverPremium,
} from "@/lib/framer-variants"
import { cn } from "@/lib/utils"

type MotionDivProps = HTMLMotionProps<"div"> & { as?: "div" }

export function FadeUp({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function FadeUpSm({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div
      variants={fadeUpSm}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function FadeIn({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function FadeLeft({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div
      variants={fadeLeft}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function FadeRight({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div
      variants={fadeRight}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function ScaleIn({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerSlow({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div
      variants={staggerSlow}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div variants={fadeUp} className={className} {...props}>
      {children}
    </motion.div>
  )
}

export function StaggerItemFast({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div variants={fadeIn} transition={{ duration: 0.3 }} className={className} {...props}>
      {children}
    </motion.div>
  )
}

export function PageWrapper({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn("min-h-screen", className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function HoverCard({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div
      whileHover={cardHoverPremium}
      whileTap={scaleTap}
      className={cn("cursor-default card-border-glow", className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function HoverScale({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div
      whileHover={scaleHover}
      whileTap={scaleTap}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerList({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div
      variants={staggerFast}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
