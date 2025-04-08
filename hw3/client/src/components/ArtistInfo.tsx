import React from 'react';
import { ArtistInfoType } from '../utils/api';

interface ArtistInfoProps {
  artistInfo: ArtistInfoType;
}

const ArtistInfo: React.FC<ArtistInfoProps> = ({ artistInfo }) => {
  return (
    <div className="artist-bio">
      <p className="text-center" style={{ fontSize: '22px', marginBottom: '-1px' }}>
        {artistInfo.name}
      </p>
      <p className="text-center" style={{ fontSize: '16px' }}>
        {artistInfo.nationality}, {artistInfo.birthday} - {artistInfo.deathday}
      </p>
      {artistInfo.biography.split(/\n\s*\n/).map((paragraph, index) => (
        <p key={index} style={{ fontSize: '14px', lineHeight: 1.2, textAlign: 'justify' }}>
          {paragraph}
        </p>
      ))}
    </div>
  );
};

export default ArtistInfo;