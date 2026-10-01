export function anomalyView(): { title: string, html: string } {
  return {
    title: "CLASSIFIED",
    html: `
<div style="font-family: 'IBM Plex Mono', monospace; padding: 2rem; color: #ffb27a;">
  <div style="margin-bottom: 2rem; border-bottom: 1px solid rgba(255,178,122,0.3); padding-bottom: 1rem;">
    <h2 style="color: #ff3300; font-size: 1.5rem; letter-spacing: 0.2em; margin-bottom: 0.5rem;">
      ⚠ RESTRICTED ARCHIVE ACCESSED
    </h2>
    <div style="opacity: 0.8; font-size: 0.9rem;">AUTHORIZATION LEVEL: V/CORE ADMINISTRATOR</div>
  </div>

  <pre style="font-size: 0.75rem; line-height: 1.2; opacity: 0.9; text-shadow: 0 0 5px rgba(255,178,122,0.5); overflow-x: auto;">
          .                                                      .
        .n                   .                 .                  n.
  .   .dP                  dP                   9b                 9b.    .
 4    qXb         .       dX                     Xb       .        dXp     t
dX.    9Xb      .dXb    __                         __    dXb.     dXP     .Xb
9XXb._       _.dXXXXb dXXXXbo.                 .odXXXXb dXXXXb._       _.dXXP
 9XXXXXXXXXXXXXXXXXXXVXXXXXXXXOo.           .oOXXXXXXXXVXXXXXXXXXXXXXXXXXXXP
  \`9XXXXXXXXXXXXXXXXXXXXX'~   ~OOO8b   d8OOO~   ~\`XXXXXXXXXXXXXXXXXXXXXP'
    \`9XXXXXXXXXXXP' \`9XX'   DIE    \`98v8P'  HUMAN   \`XXP' \`9XXXXXXXXXXXP'
        ~~~~~~~       9X.          .db|db.          .XP       ~~~~~~~
                        )b.  .dbo.dP'\`v'\`9b.odb.  .dX(
                      ,dXXXXXXXXXXXb     dXXXXXXXXXXXb.
                     dXXXXXXXXXXXP'   .   \`9XXXXXXXXXXXb
                    dXXXXXXXXXXXXb   d|b   dXXXXXXXXXXXXb
                    9XXb'   \`XXXXXb.dX|Xb.dXXXXX'   \`dXXP
                     \`'      9XXXXXX(   )XXXXXXP      \`'
                              XXXX X.\`v'.X XXXX
                              XP^X'\`b   d'\`X^XX
                              X. 9  \`   '  P .X
                              \`b  \`       '  d'
                               \`             '
  </pre>

  <div style="margin-top: 2rem; line-height: 1.6; font-size: 0.85rem; opacity: 0.8;">
    <p>> DECRYPTING PAYLOAD...</p>
    <p>> SIGNAL ORIGIN: VEDANTH.OS DEEP-SPACE RELAY S-4</p>
    <p>> TIMESTAMP: 2026.44.92.110</p>
    <p style="margin-top: 1rem;">
      [SYSTEM LOG]
      <br/>The Swarm Node cluster reported anomalous behavior in Sector 7. 
      <br/>Entity identified as self-modifying code structure. 
      <br/>Containment protocols engaged. 
      <br/>All systems nominal. Do not approach the outer orbits.
    </p>
  </div>
</div>
    `
  };
}
