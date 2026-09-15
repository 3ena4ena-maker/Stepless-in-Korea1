import { Station, translateExitNumber } from '../types';
import { getStationCrosswalkPoints, CrosswalkPoint } from './crosswalkData';

export function createGoogleMapExitMarker(
  map: any,
  exit: any,
  language: 'KR' | 'EN',
  lineColor: string
): any {
  let iconSvg = '';
  if (exit.hasElevator) {
    iconSvg = `
      <svg viewBox="0 0 24 24" fill="none" stroke="${lineColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; flex-shrink: 0; display: inline-block; vertical-align: middle;">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="${lineColor}" stroke="none" />
        <path d="M 8.5 11 L 8.5 15" stroke="${lineColor}" stroke-width="2.5" stroke-linecap="round" />
        <path d="M 6.5 17 L 10.5 17" stroke="${lineColor}" stroke-width="2.5" stroke-linecap="round" />
        <path d="M 15.5 8 L 15.5 16" stroke="${lineColor}" stroke-width="2" stroke-linecap="round" />
        <polyline points="13.5,10 15.5,8 17.5,10" stroke="${lineColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <polyline points="13.5,14 15.5,16 17.5,14" stroke="${lineColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;
  } else if (exit.hasEscalator) {
    iconSvg = `
      <svg viewBox="0 0 24 24" fill="none" stroke="${lineColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; flex-shrink: 0; display: inline-block; vertical-align: middle;">
        <circle cx="10" cy="7.5" r="1.8" fill="${lineColor}" stroke="none" />
        <path d="M 10 10.2 L 10 14" stroke="${lineColor}" stroke-width="2.5" stroke-linecap="round" />
        <path d="M 3.5 19.5 L 7.5 19.5 C 9.5 19.5, 10.5 18, 12 15.5 L 15.5 10 C 17 8, 18 7, 20.5 7 L 22.5 7" />
      </svg>
    `;
  } else {
    iconSvg = `
      <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; flex-shrink: 0; display: inline-block; vertical-align: middle;">
        <path d="M 3.5 19.5 L 7.5 19.5 L 7.5 15.5 L 11.5 15.5 L 11.5 11.5 L 15.5 11.5 L 15.5 7.5 L 20.5 7.5" />
      </svg>
    `;
  }

  const markerWidth = 140;
  const markerHeight = 44;

  const overlayDiv = document.createElement('div');
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.cursor = 'pointer';
  overlayDiv.style.userSelect = 'none';
  overlayDiv.style.zIndex = '50';
  overlayDiv.innerHTML = `
    <div style="width: ${markerWidth}px; height: ${markerHeight}px; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; position: relative;">
      <div style="background-color: white; border: 2.5px solid ${lineColor}; border-radius: 9999px; padding: 5px 12px; font-weight: 850; font-size: 11px; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.18); display: flex; align-items: center; gap: 4.5px; position: relative; margin-bottom: 2px;">
        <div style="display: flex; align-items: center; justify-content: center; min-width: 16px; height: 16px;">${iconSvg}</div>
        <span style="color: #0f172a; font-family: system-ui, sans-serif; letter-spacing: -0.02em; font-weight: 900;">${translateExitNumber(exit.number, language)}</span>
      </div>
      <div style="width: 0; height: 0; border-left: 6.5px solid transparent; border-right: 6.5px solid transparent; border-top: 7px solid ${lineColor}; margin-top: -1px;"></div>
    </div>
  `;

  class ExitOverlay extends window.google.maps.OverlayView {
    private position: any;
    private div: HTMLDivElement;

    constructor(pos: any, divEl: HTMLDivElement) {
      super();
      this.position = pos;
      this.div = divEl;
    }

    onAdd() {
      const panes = this.getPanes();
      panes.overlayMouseTarget.appendChild(this.div);

      this.div.addEventListener('click', (e) => {
        e.stopPropagation();
        map.panTo(this.position);
        const el = document.getElementById(`exit-item-${exit.number}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const tabBtn = document.getElementById(`expand-exit-btn-${exit.number}`);
          if (tabBtn) tabBtn.click();
        }
      });
    }

    draw() {
      const projection = this.getProjection();
      if (!projection) return;
      const point = projection.fromLatLngToDivPixel(this.position);
      if (point) {
        this.div.style.left = point.x - markerWidth * 0.5 + 'px';
        this.div.style.top = point.y - markerHeight + 'px';
      }
    }

    onRemove() {
      if (this.div && this.div.parentNode) {
        this.div.parentNode.removeChild(this.div);
      }
    }
  }

  const latLng = new window.google.maps.LatLng(exit.latitude, exit.longitude);
  const overlay = new ExitOverlay(latLng, overlayDiv);
  overlay.setMap(map);
  return overlay;
}

export function createGoogleMapCrosswalkMarker(
  map: any,
  pt: CrosswalkPoint,
  language: 'KR' | 'EN'
): any {
  const crosswalkWidth = 32;
  const crosswalkHeight = 32;

  const overlayDiv = document.createElement('div');
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.cursor = 'pointer';
  overlayDiv.style.userSelect = 'none';
  overlayDiv.style.zIndex = '40';
  const titleText = language === 'KR' ? pt.nameKr : pt.nameEn;
  overlayDiv.title = titleText;
  overlayDiv.innerHTML = `
    <div style="width: ${crosswalkWidth}px; height: ${crosswalkHeight}px; display: flex; align-items: center; justify-content: center; background-color: #ffffff; border: 2.5px solid #2563eb; border-radius: 9999px; box-shadow: 0 3px 10px rgba(0,0,0,0.18);">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
        <g fill="#2563eb">
          <polygon points="4.5,5 5.5,5 2.5,19 0.5,19" />
          <polygon points="6.5,5 7.5,5 5.5,19 3.7,19" />
          <polygon points="8.5,5 9.5,5 8.5,19 6.8,19" />
          <polygon points="10.5,5 11.5,5 11.3,19 9.8,19" />
          <polygon points="12.5,5 13.5,5 14.2,19 12.7,19" />
          <polygon points="14.5,5 15.5,5 17.2,19 15.5,19" />
          <polygon points="16.5,5 17.5,5 20.3,19 18.5,19" />
          <polygon points="18.5,5 19.5,5 23.5,19 21.5,19" />
        </g>
      </svg>
    </div>
  `;

  class CrosswalkOverlay extends window.google.maps.OverlayView {
    private position: any;
    private div: HTMLDivElement;

    constructor(pos: any, divEl: HTMLDivElement) {
      super();
      this.position = pos;
      this.div = divEl;
    }

    onAdd() {
      const panes = this.getPanes();
      panes.overlayMouseTarget.appendChild(this.div);
    }

    draw() {
      const projection = this.getProjection();
      if (!projection) return;
      const point = projection.fromLatLngToDivPixel(this.position);
      if (point) {
        this.div.style.left = point.x - crosswalkWidth * 0.5 + 'px';
        this.div.style.top = point.y - crosswalkHeight * 0.5 + 'px';
      }
    }

    onRemove() {
      if (this.div && this.div.parentNode) {
        this.div.parentNode.removeChild(this.div);
      }
    }
  }

  const latLng = new window.google.maps.LatLng(pt.lat, pt.lng);
  const overlay = new CrosswalkOverlay(latLng, overlayDiv);
  overlay.setMap(map);
  return overlay;
}
