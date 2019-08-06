import {
  trigger, animate, style, group, query,
  transition, animateChild, animation, useAnimation, state } from '@angular/animations';

const customAnimation = animation([
  style({
      opacity  : '{{opacity}}',
      transform: 'scale({{scale}}) translate3d({{x}}, {{y}}, {{z}})'
  }),
  animate('{{duration}} {{delay}} cubic-bezier(0.0, 0.0, 0.2, 1)', style('*'))
], {
  params: {
      duration: '200ms',
      delay   : '0ms',
      opacity : '0',
      scale   : '1',
      x       : '0',
      y       : '0',
      z       : '0'
  }
});


export const tgAnimations = [

  trigger('detailExpand', [
    state('collapsed', style({height: '0px', minHeight: '0'})),
    state('expanded', style({height: '*'})),
    transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  ]),

  trigger('animate', [transition('void => *', [useAnimation(customAnimation)])]),

  trigger('routerTransitionFade', [

    transition('* => *', group([

      query('content > :enter, content > :leave ', [
        style({
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        })
      ], { optional: true }),

      query('content > :enter', [
        style({
          opacity: 0
        })
      ], { optional: true }),
      query('content > :leave', [
        style({
          opacity: 1
        }),
        animate('300ms cubic-bezier(0.0, 0.0, 0.2, 1)',
          style({
            opacity: 0
          }))
      ], { optional: true }),
      query('content > :enter', [
        style({
          opacity: 0
        }),
        animate('300ms cubic-bezier(0.0, 0.0, 0.2, 1)',
          style({
            opacity: 1
          }))
      ], { optional: true }),
      query('content > :enter', animateChild(), { optional: true }),
      query('content > :leave', animateChild(), { optional: true })
    ]))
  ])
];
