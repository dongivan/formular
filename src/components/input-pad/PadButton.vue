<template>
  <div
    ref="refPadRoot"
    class="w-full h-full relative"
    :class="{ group: children }"
    :style="gridStyleRef"
  >
    <template v-if="children">
      <div
        class="hover-hover:group-hover:block absolute top-[-0.25rem] left-[-0.25rem] w-[calc((100vw-0.25rem)/7+0.25rem)] sm:w-[calc(100%+0.5rem)] h-[calc((100vw-0.25rem)/7+0.25rem)] sm:h-[calc(100%+0.5rem)] bg-gray-500 -z-10 rounded-b-lg"
        :class="{ hidden: !refIsTouching, block: refIsTouching }"
      ></div>
      <div
        class="hover-hover:group-hover:flex absolute top-[calc(-100%-0.5rem)] h-full m-w-full box-content p-1 bg-gray-500 rounded-lg gap-1 z-10"
        :class="{
          hidden: !refIsTouching,
          flex: refIsTouching,
          'flex-row-reverse': childrenReverse,
          'rounded-bl-none': !childrenReverse,
          'rounded-br-none': childrenReverse,
        }"
        :style="[childrenPositionRef]"
      >
        <IconButton
          v-for="(child, i) of children"
          :key="`btn-${button.commands}-${child.commands}`"
          :data="child"
          :active="refTouchChildIndex == i"
          @click="emit('click', child.commands)"
        />
      </div>
    </template>
    <IconButton
      ref="refIconButton"
      :data="button"
      :top-bar="children && children.length > 2"
      :sub-icon="
        subIcon ||
        (children && children.length == 2 ? children[1].icon : undefined)
      "
      :active="active"
      @click="emit('click', button.commands)"
      @touchstart="handleTouchstart"
      @touchmove="handleTouchmove"
      @touchend="handleTouchend"
    />
  </div>
</template>

<script setup lang="ts">
import { IconButtonType, IconType, PadButtonType } from "./buttons";
import { computed, PropType, ref } from "vue";
import IconButton from "./IconButton.vue";

const props = defineProps({
  button: {
    type: Object as PropType<PadButtonType | IconButtonType>,
    required: true,
  },
  children: {
    type: Array as PropType<Array<IconButtonType>>,
    default: undefined,
  },
  childrenReverse: { type: Boolean, default: false },
  subIcon: { type: Object as PropType<IconType>, default: undefined },
  active: { type: Boolean, default: false },
});
const emit = defineEmits<{
  (event: "click", commands: [string, ...string[]]): void;
}>();

const gridStyleRef = computed(() => {
  return "row" in props.button
    ? {
        gridRow: `${props.button.row} / span ${props.button.rowSpan || 1}`,
        gridColumn: `${props.button.column} / span ${
          props.button.colSpan || 1
        }`,
      }
    : undefined;
});

const refHasChildren = computed(() => {
  return props.children && props.children.length > 1;
});

const childrenPositionRef = computed(() => {
  if (!refHasChildren.value) {
    return {};
  }
  return props.childrenReverse ? { right: "-0.25em" } : { left: "-0.25em" };
  // const n = props.children?.length || 0;
  // return { left: `calc(50% - ((100% + 0.25rem) * ${n} + 0.25rem) / 2)` };
});

const refIsTouching = ref(false);
const refTouchBaseX = ref(0);
const refTouchChildIndex = ref(-1);
const refButtonWidth = ref(48);
const refPadRoot = ref();
const refIconButton = ref();

function handleTouchstart(evt: TouchEvent) {
  refIconButton.value.focus();
  refIsTouching.value = true;
  if (refHasChildren.value) {
    refTouchChildIndex.value = 0;
    refTouchBaseX.value = evt.targetTouches[0].clientX;
    refButtonWidth.value = refPadRoot.value.clientWidth;
  }
}

function handleTouchmove(evt: TouchEvent) {
  if (refHasChildren.value) {
    refTouchChildIndex.value = Math.floor(
      ((evt.changedTouches[0].clientX - refTouchBaseX.value) /
        refButtonWidth.value) *
        (props.childrenReverse ? -1 : 1) +
        0.5
    );
  }
}

function handleTouchend(evt: TouchEvent) {
  if (refHasChildren.value) {
    const button = props.children?.[refTouchChildIndex.value];
    if (button) {
      emit("click", button.commands);
    }
    refIsTouching.value = false;
    refTouchBaseX.value = 0;
    refTouchChildIndex.value = -1;
  } else {
    emit("click", props.button.commands);
  }
  evt.preventDefault();
}
</script>
