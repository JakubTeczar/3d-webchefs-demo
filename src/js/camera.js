import { Vector3 } from "three";
import { gsap } from "gsap";

/**
 * Smoothly animates a camera to a target position and look-at point.
 * @param {THREE.Camera} camera - The camera to animate.
 * @param {THREE.Vector3} targetPosition - The target position to move the camera to.
 * @param {THREE.Vector3} targetLookAt - The target point for the camera to look at.
 * @param {number} duration - Duration of the animation in seconds.
 * @param {string} ease - Easing function for the animation.
 */
export function animateCamera(camera, targetPosition, targetLookAt, duration = 2, ease = "power2.inOut") {
  gsap.to(camera.position, {
    x: targetPosition.x,
    y: targetPosition.y,
    z: targetPosition.z,
    duration: duration,
    ease: ease,
    onUpdate: () => {
      camera.lookAt(targetLookAt);
    },
  });
}