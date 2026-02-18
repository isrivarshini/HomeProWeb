import { Card, CardContent, Skeleton, Box } from '@mui/material';

const ProviderCardSkeleton = () => {
  return (
    <Card sx={{ height: '100%' }}>
      {/* Image skeleton */}
      <Skeleton 
        variant="rectangular" 
        height={200} 
        sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }} 
      />
      
      <CardContent sx={{ p: 3 }}>
        {/* Title skeleton */}
        <Skeleton 
          variant="text" 
          width="70%" 
          height={32} 
          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', mb: 1 }} 
        />
        
        {/* Rating skeleton */}
        <Skeleton 
          variant="text" 
          width="40%" 
          height={24} 
          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', mb: 2 }} 
        />
        
        {/* Description skeleton */}
        <Skeleton 
          variant="text" 
          width="100%" 
          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }} 
        />
        <Skeleton 
          variant="text" 
          width="90%" 
          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', mb: 2 }} 
        />
        
        {/* Price chip skeleton */}
        <Skeleton 
          variant="rounded" 
          width={100} 
          height={32} 
          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', mb: 2 }} 
        />
        
        {/* Button skeleton */}
        <Skeleton 
          variant="rounded" 
          width="100%" 
          height={42} 
          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }} 
        />
      </CardContent>
    </Card>
  );
};

export default ProviderCardSkeleton;