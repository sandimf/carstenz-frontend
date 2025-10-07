#!/bin/bash

components=(
  alert-dialog
  aspect-ratio
  avatar
  badge
  breadcrumb
  button
  calendar
  card
  carousel
  chart
  checkbox
  collapsible
  command
  context-menu
  table
  dialog
  drawer
  dropdown-menu
  hover-card
  input
  input-otp
  label
  menubar
  navigation-menu
  pagination
  popover
  progress
  radio-group
  resizable
  scroll-area
  select
  separator
  sheet
  skeleton
  slider
  sonner
  switch
  tabs
  textarea
  toggle
  toggle-group
  tooltip
)

for component in "${components[@]}"; do
  echo "Adding component: $component"
  npx shadcn@latest add "$component"
done
