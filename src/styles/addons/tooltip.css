[data-tooltip]::before,
[data-tooltip]::after {
  left: 50%;
  opacity: 0;
  position: absolute;
  z-index: -100;
}

[data-tooltip]:hover::before,
[data-tooltip]:focus::before,
[data-tooltip]:hover::after,
[data-tooltip]:focus::after {
  opacity: 1;
  transform: scale(1) translateY(0);
  z-index: 100;
}

/*== pointer tip ==*/
[data-tooltip]::before {
  border-style: solid;
  border-width: 1em 0.75em 0 0.75em;
  border-color: #3e474f transparent transparent transparent;
  bottom: 100%;
  content: "";
  top: -2em;
  margin-left: -0.5em;
  transition: all 0.65s cubic-bezier(0.84, -0.18, 0.31, 1.26),
    opacity 0.65s 0.5s;
  transform: scale(0.6) translateY(-90%);
}

[data-tooltip]:hover::before,
[data-tooltip]:focus::before {
  transition: all 0.65s cubic-bezier(0.84, -0.18, 0.31, 1.26) 0.2s;
}

/*== speech bubble ==*/
[data-tooltip]::after {
  background: #3e474f;
  border-radius: 0.25em;
  bottom: 180%;
  color: #edeff0;
  content: attr(data-tooltip-content);
  margin-left: -8.75em;
  padding: 1em;
  transition: all 0.65s cubic-bezier(0.84, -0.18, 0.31, 1.26) 0.2s;
  transform: scale(0.6) translateY(50%);
  width: 17.5em;
}

[data-tooltip]:hover::after,
[data-tooltip]:focus::after {
  transition: all 0.65s cubic-bezier(0.84, -0.18, 0.31, 1.26);
}

@media (max-width: 760px) {
  [data-tooltip]::after {
    font-size: 0.75em;
    margin-left: -5em;
    width: 10em;
  }
}

.tooltip {
  --tooltip-spacing: 2.25rem;
  @apply font-sans text-xs flex justify-center items-center bg-muted-800 dark:bg-muted-400 text-white dark:text-black rounded-md whitespace-nowrap z-[1000] absolute p-2;
}

.tooltip-wrapper {
  @apply relative flex justify-center items-center;
}

.tooltip::before {
  @apply content-[''] border-solid border-transparent border-[5px] bg-muted-800 dark:bg-muted-400 text-white dark:text-black absolute pointer-events-none rotate-45 z-[-1] w-[0] h-[0];
}

.tooltip-content {
  @apply text-white dark:text-black text-xs;
}

.tooltip.tooltip-top {
  @apply top-[calc(var(--tooltip-spacing,_44px)_*_-1)];
}

.tooltip.tooltip-top::before {
  @apply bottom-[-4px] start-1/2 ms-[-4px];
}

.tooltip.tooltip-end {
  @apply top-1/2 -translate-y-1/2 start-[calc(100%_+_0.75rem)];
}

.tooltip.tooltip-end::before {
  @apply ms-[-4px] start-0 top-[calc(50%_-_5px)];
}

.tooltip.tooltip-bottom {
  @apply bottom-[calc(var(--tooltip-spacing,_50px)_*_-1)];
}

.tooltip.tooltip-bottom::before {
  @apply top-[-4px] start-1/2 ms-[-4px];
}

.tooltip.tooltip-start {
  @apply top-1/2 -translate-y-1/2 end-[calc(100%_+_0.75rem)];
}

.tooltip.tooltip-start::before {
  @apply me-[-4px] end-0 top-[calc(50%_-_5px)];
}

/* Dark tooltip with light colors */
[data-dark-tooltip]::before,
[data-dark-tooltip]::after {
  left: 50%;
  opacity: 0;
  position: absolute;
  z-index: -100;
}

[data-dark-tooltip]:hover::before,
[data-dark-tooltip]:focus::before,
[data-dark-tooltip]:hover::after,
[data-dark-tooltip]:focus::after {
  opacity: 1;
  transform: scale(1) translateY(0);
  z-index: 100;
}

/*== pointer tip ==*/
[data-dark-tooltip]::before {
  border-style: solid;
  border-width: 1em 0.75em 0 0.75em;
  border-color: #edeff0 transparent transparent transparent;
  bottom: 100%;
  content: "";
  top: -2em;
  margin-left: -0.5em;
  transition: all 0.65s cubic-bezier(0.84, -0.18, 0.31, 1.26),
    opacity 0.65s 0.5s;
  transform: scale(0.6) translateY(-90%);
}

[data-dark-tooltip]:hover::before,
[data-dark-tooltip]:focus::before {
  transition: all 0.65s cubic-bezier(0.84, -0.18, 0.31, 1.26) 0.2s;
}

/*== speech bubble ==*/
[data-dark-tooltip]::after {
  background: #edeff0;
  border-radius: 0.25em;
  bottom: 180%;
  color: #3e474f;
  content: attr(data-tooltip-content);
  margin-left: -8.75em;
  padding: 1em;
  transition: all 0.65s cubic-bezier(0.84, -0.18, 0.31, 1.26) 0.2s;
  transform: scale(0.6) translateY(50%);
  width: 17.5em;
}

[data-dark-tooltip]:hover::after,
[data-dark-tooltip]:focus::after {
  transition: all 0.65s cubic-bezier(0.84, -0.18, 0.31, 1.26);
}

@media (max-width: 760px) {
  [data-dark-tooltip]::after {
    font-size: 0.75em;
    margin-left: -5em;
    width: 10em;
  }
}

.dark-tooltip {
  --tooltip-spacing: 2.25rem;
  @apply font-sans text-xs flex justify-center items-center bg-muted-100 dark:bg-muted-800 rounded-md whitespace-nowrap z-[1000] absolute p-2;
}

.dark-tooltip-wrapper {
  @apply relative flex justify-center items-center;
}

.dark-tooltip::before {
  @apply content-[''] border-solid border-transparent border-[5px] bg-muted-100 dark:bg-muted-800 absolute pointer-events-none rotate-45 z-[-1] w-[0] h-[0];
}

.dark-tooltip-content {
  @apply text-black text-xs;
}

.dark-tooltip.dark-tooltip-top {
  @apply top-[calc(var(--tooltip-spacing,_44px)_*_-1)];
}

.dark-tooltip.dark-tooltip-top::before {
  @apply bottom-[-4px] start-1/2 ms-[-4px];
}

.dark-tooltip.dark-tooltip-end {
  @apply top-1/2 -translate-y-1/2 start-[calc(100%_+_0.75rem)];
}

.dark-tooltip.dark-tooltip-end::before {
  @apply ms-[-4px] start-0 top-[calc(50%_-_5px)];
}

.dark-tooltip.dark-tooltip-bottom {
  @apply bottom-[calc(var(--tooltip-spacing,_50px)_*_-1)];
}

.dark-tooltip.dark-tooltip-bottom::before {
  @apply top-[-4px] start-1/2 ms-[-4px];
}

.dark-tooltip.dark-tooltip-start {
  @apply top-1/2 -translate-y-1/2 end-[calc(100%_+_0.75rem)];
}

.dark-tooltip.dark-tooltip-start::before {
  @apply me-[-4px] end-0 top-[calc(50%_-_5px)];
}
