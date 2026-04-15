import {
    HardcoverIcon,
    WireOIcon,
    SpiralIcon,
    PerfectBoundIcon,
    SaddleStitchIcon,
    SectionSewnIcon
} from './components/BindingIcons';
import {
    VerticalIcon,
    HorizontalIcon,
    SquareIcon
} from './components/FormatIcons';
import {
    View34Icon,
    FrontViewIcon,
    IsometricIcon,
    SpineViewIcon,
    CloseupIcon
} from './components/PerspectiveIcons';


export const BINDING_TYPES = [
  { value: 'perfect bound', label: 'Perfect Bound', icon: PerfectBoundIcon },
  { value: 'saddle stitch', label: 'Saddle Stitch', icon: SaddleStitchIcon },
  { value: 'hardcover', label: 'Hardcover', icon: HardcoverIcon },
  { value: 'wire-o', label: 'Wire-O', icon: WireOIcon },
  { value: 'spiral', label: 'Spiral/Coil', icon: SpiralIcon },
  { value: 'section sewn', label: 'Section Sewn', icon: SectionSewnIcon },
];

export const COVER_FINISHES = [
  { value: 'matte', label: 'Matte' },
  { value: 'glossy', label: 'Glossy' },
  { value: 'satin', label: 'Satin' },
  { value: 'uncoated', label: 'Uncoated' },
];

export const MATERIAL_TEXTURES = [
  { value: 'smooth', label: 'Smooth' },
  { value: 'linen', label: 'Linen' },
  { value: 'cloth', label: 'Cloth' },
  { value: 'leatherette', label: 'Leatherette' },
];

export const CASE_WRAPS = [
  { value: 'full case wrap', label: 'Full Case Wrap (Printed Cover)' },
  { value: 'dust jacket with matte laminate', label: 'Dust Jacket (Matte Laminate)' },
  { value: 'dust jacket with spot uv coating', label: 'Dust Jacket (Spot UV)' },
  { value: 'dust jacket with foil stamping', label: 'Dust Jacket (Foil Stamping)' },
];

export const PERSPECTIVE_OPTIONS = [
    { value: 'slightly angled 3/4 view', label: '3/4 View', icon: View34Icon },
    { value: 'front view, straight-on', label: 'Front', icon: FrontViewIcon },
    { value: 'isometric view from above', label: 'Isometric', icon: IsometricIcon },
    { value: 'view of the book standing upright, looking directly at the spine so that only the spine is visible.', label: 'Spine View', icon: SpineViewIcon },
    { value: 'close-up detail shot on the spine and corner', label: 'Close-up', icon: CloseupIcon },
];

export const BOOK_FORMAT_OPTIONS = [
  { value: 'vertical', label: 'Vertical', icon: VerticalIcon },
  { value: 'horizontal', label: 'Horizontal', icon: HorizontalIcon },
  { value: 'square', label: 'Square', icon: SquareIcon },
];
