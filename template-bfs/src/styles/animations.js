export const fadeInUp = { hidden:{opacity:0,y:32}, visible:{opacity:1,y:0,transition:{duration:0.55,ease:[0.25,0.1,0.25,1]}} }
export const fadeIn   = { hidden:{opacity:0},      visible:{opacity:1,transition:{duration:0.5}} }
export const fadeInLeft  = { hidden:{opacity:0,x:-44}, visible:{opacity:1,x:0,transition:{duration:0.6,ease:"easeOut"}} }
export const fadeInRight = { hidden:{opacity:0,x:44},  visible:{opacity:1,x:0,transition:{duration:0.6,ease:"easeOut"}} }
export const scaleIn  = { hidden:{opacity:0,scale:0.94}, visible:{opacity:1,scale:1,transition:{duration:0.45,ease:"easeOut"}} }
export const stagger  = { hidden:{}, visible:{transition:{staggerChildren:0.09,delayChildren:0.05}} }
export const staggerSlow = { hidden:{}, visible:{transition:{staggerChildren:0.14,delayChildren:0.1}} }
export const heroTitle = { hidden:{opacity:0,y:60,skewY:1}, visible:{opacity:1,y:0,skewY:0,transition:{duration:1,ease:[0.16,1,0.3,1]}} }
export const heroSub   = { hidden:{opacity:0,y:24}, visible:{opacity:1,y:0,transition:{duration:0.65,delay:0.25}} }
export const heroCTA   = { hidden:{opacity:0},       visible:{opacity:1,transition:{duration:0.5,delay:0.44}} }
export const pageTransition = {
  initial:{ opacity:0, y:14 },
  animate:{ opacity:1, y:0,  transition:{ duration:0.35, ease:"easeOut" } },
  exit:   { opacity:0, y:-8, transition:{ duration:0.2  } },
}
export const viewportOnce = { once:true, margin:"-60px" }
