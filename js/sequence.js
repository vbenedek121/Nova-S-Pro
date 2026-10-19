// Each physical ball is sampled independently. Repeats are allowed, including
// two equal types/positions in a row. A new plan is drawn for every round.
export function roundBatches(drill, rng=Math.random) {
  const options=drill.random;
  if (!options?.type && !options?.direction && !options?.height) return [{...drill,balls:drill.balls.map(b=>({...b}))}];
  const balls=[];
  for (const template of drill.balls) {
    for (let i=0;i<template.reps;i++) {
      const ball={...template,reps:1};
      if (options.type) {
        delete ball.motor;
        ball.type=['back','none','top'][Math.floor(rng()*3)];
        ball.spin=ball.type==='none'?0:options.spin;
      }
      if (options.direction) ball.drop=options.min+Math.floor(rng()*((options.max-options.min)*2+1))/2;
      if (options.height) ball.height=options.heightMin+Math.floor(rng()*(options.heightMax-options.heightMin+1));
      balls.push(ball);
    }
  }
  // Stay within the established five-entry packet format. Only send the next
  // batch after the preceding one has been acknowledged as completed.
  const batches=[];
  for (let i=0;i<balls.length;i+=5) batches.push({...drill,balls:balls.slice(i,i+5)});
  return batches;
}

